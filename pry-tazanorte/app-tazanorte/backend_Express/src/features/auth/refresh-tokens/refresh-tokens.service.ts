import { Transaction } from "sequelize";
import { randomUUID } from "node:crypto";
import { RefreshTokenResponseDto, toRefreshTokenResponse } from "./dto";
import { RefreshTokensRepository } from "./refresh-tokens.repository";
import { RefreshToken } from "./refresh-token.model";
import { AppError } from "../../../shared/errors/app-error";
import { generateOpaqueToken, sha256Hex } from "../../../shared/auth/password";
import { withTransaction } from "../../../shared/database/with-transaction";

/** Vida útil del refresh token, en días (`.env`: `JWT_REFRESH_TTL_DAYS`). */
const REFRESH_TTL_DAYS = Number(process.env.JWT_REFRESH_TTL_DAYS ?? 7);

/** Sesión recién emitida: el token en claro se entrega **una sola vez**. */
export interface IssuedSession {
  rawToken: string;
  familyId: string;
  expiresAt: Date;
}

/** Resultado de presentar un refresh token para rotarlo. */
export type RotationOutcome =
  | { kind: "rotated"; userId: number; rawToken: string; familyId: string; expiresAt: Date }
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "reuse"; familyId: string; revoked: number };

/**
 * Capa Service del feature RefreshTokens (sesiones renovables y revocables).
 *
 * Ciclo de vida:
 *  - **issue**: login -> token opaco nuevo con un `family_id` nuevo.
 *  - **rotate**: refresh -> el token usado se invalida y nace otro en la misma familia.
 *  - **reuse detection**: presentar un token ya rotado revoca toda la familia.
 *  - **revoke**: logout (un token) o "cerrar todas mis sesiones".
 *
 * En la BD solo vive el hash SHA-256; el token en claro nunca se guarda.
 */
export class RefreshTokensService {
  public constructor(
    private readonly repository: RefreshTokensRepository = new RefreshTokensRepository()
  ) {}

  // ================== GESTIÓN (sesiones propias) ==================
  public async getAllMine(userId: number): Promise<RefreshTokenResponseDto[]> {
    const tokens = await this.repository.findActiveByUser(userId);
    return tokens.map((token) => toRefreshTokenResponse(token));
  }

  public async getMine(userId: number, id: number): Promise<RefreshTokenResponseDto> {
    return toRefreshTokenResponse(await this.findMineOrFail(userId, id));
  }

  /** Revoca una sesión propia concreta. */
  public async revokeMine(userId: number, id: number): Promise<RefreshTokenResponseDto> {
    const token = await this.findMineOrFail(userId, id);
    await this.repository.update(token, { status: "inactive" });
    return toRefreshTokenResponse(token);
  }

  /** Revoca **todas** las sesiones propias (útil si se sospecha un robo). */
  public async revokeAllMine(userId: number): Promise<number> {
    return this.repository.revokeAllByUser(userId);
  }

  /** Purga (borrado físico) las sesiones propias ya revocadas o expiradas. */
  public async purgeMine(userId: number): Promise<number> {
    return this.repository.purgeInactiveByUser(userId);
  }

  // ================== CICLO DE VIDA ==================
  /** Emite una sesión nueva (login). Genera un `family_id` nuevo. */
  public async issue(userId: number, deviceInfo: string | null, transaction?: Transaction): Promise<IssuedSession> {
    const rawToken = generateOpaqueToken();
    const familyId = randomUUID();
    const expiresAt = expiryFromNow();

    await this.repository.create(
      {
        user_id: userId,
        token_hash: sha256Hex(rawToken),
        family_id: familyId,
        device_info: deviceInfo,
        expires_at: expiresAt,
        status: "active",
      },
      transaction
    );

    // El token en claro se devuelve **una sola vez**; en la base solo queda el hash.
    return { rawToken, familyId, expiresAt };
  }

  /**
   * Rota un refresh token: lo invalida y emite uno nuevo con el mismo `family_id`.
   * Todo dentro de una transacción con bloqueo de fila (`FOR UPDATE`).
   *
   * Si dos peticiones presentan el mismo token a la vez, una rota y la otra lo
   * encuentra ya inactivo -> se interpreta como reutilización y se revoca la familia.
   */
  public async rotate(rawToken: string, deviceInfo: string | null): Promise<RotationOutcome> {
    const hash = sha256Hex(rawToken);

    // El resultado se decide dentro de la transacción, pero NO se lanza error ahí:
    // así la revocación de la familia queda confirmada aunque la respuesta sea un rechazo.
    return withTransaction<RotationOutcome>(async (t) => {
      const current = await this.repository.findByHash(hash, t, true);
      if (!current) {
        return { kind: "invalid" };
      }

      // REUSE DETECTION: el token existía pero ya no está activo (fue rotado o revocado).
      if (current.status !== "active") {
        const revoked = await this.repository.revokeFamily(current.family_id, t);
        return { kind: "reuse", familyId: current.family_id, revoked };
      }

      if (new Date(current.expires_at).getTime() <= Date.now()) {
        await this.repository.update(current, { status: "inactive" }, t);
        return { kind: "expired" };
      }

      // Rotación: el token usado se invalida y nace uno nuevo en la misma familia.
      await this.repository.update(current, { status: "inactive" }, t);
      const rawNext = generateOpaqueToken();
      const expiresAt = expiryFromNow();
      await this.repository.create(
        {
          user_id: current.user_id,
          token_hash: sha256Hex(rawNext),
          family_id: current.family_id,
          device_info: deviceInfo ?? current.device_info,
          expires_at: expiresAt,
          status: "active",
        },
        t
      );

      return { kind: "rotated", userId: current.user_id, rawToken: rawNext, familyId: current.family_id, expiresAt };
    });
  }

  /**
   * Cierra la sesión asociada a un refresh token (logout).
   *
   * Idempotente: un token inexistente o ya revocado no es un error, porque el
   * efecto deseado (que no sirva) ya se cumple.
   */
  public async revokeByToken(rawToken: string): Promise<boolean> {
    const token = await this.repository.findByHash(sha256Hex(rawToken));
    if (!token) return false;
    if (token.status !== "active") return true;
    await this.repository.update(token, { status: "inactive" });
    return true;
  }

  // ================== HELPERS ==================
  /**
   * Busca una sesión **del propio usuario**.
   *
   * El filtro por `user_id` es la frontera de seguridad: aunque el RBAC no
   * intervenga en estas rutas, un usuario nunca puede ver ni revocar la sesión
   * de otro. Un `id` ajeno responde 404, no 403 (no se revela que existe).
   */
  private async findMineOrFail(userId: number, id: number): Promise<RefreshToken> {
    const token = await this.repository.findById(id);
    if (!token || token.user_id !== userId) {
      throw new AppError(404, "Session not found");
    }
    return token;
  }
}

function expiryFromNow(): Date {
  return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}
