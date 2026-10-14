import { randomUUID } from "crypto";
import { Transaction } from "sequelize";
import { sequelize } from "../../../shared/database";
import { UserModel } from "../../../shared/database/models/user.model";
import { RoleModel } from "../../../shared/database/models/role.model";
import { RefreshTokenModel } from "../../../shared/database/models/refresh-token.model";
import { PasswordHasher } from "../../../shared/auth/password";
import { JwtService } from "../../../shared/auth/jwt";
import { AppError } from "../../../shared/errors/app-error";
import {
  LoginDto,
  SessionResponseDto
} from "./dto/session.dto";

const REFRESH_DAYS = 7;

function refreshExpiry(): Date {
  return new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
}

function makeAccessToken(user: UserModel, roles: string[]): string {
  return JwtService.signAccessToken({
    sub: user.id,
    email: user.email,
    roles
  });
}

async function getUserRoles(user: UserModel): Promise<string[]> {
  const userWithRoles = await UserModel.findByPk(user.id, {
    include: [{
      model: RoleModel,
      attributes: ["id", "name"],
      through: { attributes: [] }
    }]
  });

  return (userWithRoles?.roles ?? []).map((role) => role.name);
}

export class SessionService {
  async login(dto: LoginDto, deviceInfo?: string): Promise<SessionResponseDto> {
    const email = dto.email.trim().toLowerCase();

    const user = await UserModel.findOne({
      where: { email },
      attributes: ["id", "name", "email", "password_hash", "is_active"]
    });

    if (!user || !user.is_active) {
      throw new AppError(401, "Credenciales inválidas o usuario inactivo.");
    }

    const validPassword = await PasswordHasher.compare(
      dto.password,
      user.password_hash
    );

    if (!validPassword) {
      throw new AppError(401, "Credenciales inválidas.");
    }

    const roles = await getUserRoles(user);
    const accessToken = makeAccessToken(user, roles);
    const refreshToken = PasswordHasher.generateOpaqueToken();

    await RefreshTokenModel.create({
      user_id: user.id,
      token_hash: PasswordHasher.hashToken(refreshToken),
      expires_at: refreshExpiry(),
      is_revoked: false
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN || "15m",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles
      }
    };
  }

  async refresh(rawToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: "Bearer";
    expires_in: string;
  }> {
    if (!rawToken || rawToken.length > 500) {
      throw new AppError(401, "Refresh token inválido.");
    }

    const tokenHash = PasswordHasher.hashToken(rawToken);

    const result = await sequelize.transaction(async (transaction: Transaction) => {
      const record = await RefreshTokenModel.findOne({
        where: {
          token_hash: tokenHash,
          is_revoked: false
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!record || record.expires_at.getTime() <= Date.now()) {
        if (record) {
          await record.update({ is_revoked: true }, { transaction });
        }
        throw new AppError(401, "Refresh token inválido o expirado.");
      }

      const user = await UserModel.findByPk(record.user_id, { transaction });

      if (!user || !user.is_active) {
        await record.update({ is_revoked: true }, { transaction });
        throw new AppError(401, "Usuario inexistente o inactivo.");
      }

      await record.update({ is_revoked: true }, { transaction });

      const roles = await getUserRoles(user);
      const nextRefresh = PasswordHasher.generateOpaqueToken();

      await RefreshTokenModel.create({
        user_id: user.id,
        token_hash: PasswordHasher.hashToken(nextRefresh),
        expires_at: refreshExpiry(),
        is_revoked: false
      }, { transaction });

      return {
        access_token: makeAccessToken(user, roles),
        refresh_token: nextRefresh,
        token_type: "Bearer" as const,
        expires_in: process.env.JWT_EXPIRES_IN || "15m"
      };
    });

    return result;
  }

  async logout(rawToken: string): Promise<void> {
    if (!rawToken || rawToken.length > 500) {
      return;
    }

    await RefreshTokenModel.update(
      { is_revoked: true },
      {
        where: {
          token_hash: PasswordHasher.hashToken(rawToken),
          is_revoked: false
        }
      }
    );
  }

  async profile(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    roles: string[];
  }> {
    const user = await UserModel.findByPk(userId, {
      attributes: ["id", "name", "email", "is_active"]
    });

    if (!user || !user.is_active) {
      throw new AppError(404, "Usuario no encontrado o inactivo.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: await getUserRoles(user)
    };
  }
}
