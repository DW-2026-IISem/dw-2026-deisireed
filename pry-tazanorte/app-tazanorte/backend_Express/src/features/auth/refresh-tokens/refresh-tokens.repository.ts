import { CreationAttributes, Op, Transaction } from "sequelize";
import { RefreshToken, RefreshTokenI } from "./refresh-token.model";

/**
 * Capa Repository del feature RefreshTokens (tabla `refresh_tokens`).
 *
 * Única que habla con Sequelize. El token en claro **nunca** llega aquí: todas
 * las búsquedas son por su hash SHA-256 (`token_hash`).
 */
export class RefreshTokensRepository {
  // ================== READ ==================
  /**
   * Busca por hash del token.
   *
   * `lock: true` añade `FOR UPDATE` dentro de la transacción: es lo que hace que
   * la rotación sea segura bajo concurrencia (solo una petición gana).
   */
  public async findByHash(tokenHash: string, transaction?: Transaction, lock = false): Promise<RefreshToken | null> {
    return RefreshToken.findOne({
      where: { token_hash: tokenHash },
      transaction,
      ...(lock && transaction ? { lock: transaction.LOCK.UPDATE } : {}),
    });
  }

  /** Sesiones activas de un usuario (más recientes primero). */
  public async findActiveByUser(userId: number): Promise<RefreshToken[]> {
    return RefreshToken.findAll({ where: { user_id: userId, status: "active" }, order: [["createdAt", "DESC"]] });
  }

  /** Una sesión por PK (o `null`). */
  public async findById(id: number): Promise<RefreshToken | null> {
    return RefreshToken.findByPk(id);
  }

  // ================== CREATE ==================
  /** Inserta un refresh token (alta de sesión o rotación). */
  public async create(data: CreationAttributes<RefreshToken>, transaction?: Transaction): Promise<RefreshToken> {
    return RefreshToken.create(data, { transaction });
  }

  // ================== UPDATE ==================
  public async update(token: RefreshToken, data: Partial<RefreshTokenI>, transaction?: Transaction): Promise<RefreshToken> {
    return token.update(data, { transaction });
  }

  /**
   * Revoca **toda la familia** de rotación.
   *
   * Se ejecuta al detectar la reutilización de un token ya rotado: si alguien
   * tiene una copia del token anterior, la sesión completa se invalida y el
   * usuario debe autenticarse de nuevo (reuse detection, OWASP/OAuth2).
   */
  public async revokeFamily(familyId: string, transaction?: Transaction): Promise<number> {
    const [updated] = await RefreshToken.update(
      { status: "inactive" },
      { where: { family_id: familyId, status: "active" }, transaction }
    );
    return updated;
  }

  /** Revoca todas las sesiones activas de un usuario (cierre de sesión global). */
  public async revokeAllByUser(userId: number): Promise<number> {
    const [updated] = await RefreshToken.update(
      { status: "inactive" },
      { where: { user_id: userId, status: "active" } }
    );
    return updated;
  }

  // ================== DELETE ==================
  /** Elimina físicamente las sesiones ya revocadas o expiradas de un usuario. */
  public async purgeInactiveByUser(userId: number): Promise<number> {
    return RefreshToken.destroy({
      where: {
        user_id: userId,
        [Op.or]: [{ status: "inactive" }, { expires_at: { [Op.lt]: new Date() } }],
      },
    });
  }
}
