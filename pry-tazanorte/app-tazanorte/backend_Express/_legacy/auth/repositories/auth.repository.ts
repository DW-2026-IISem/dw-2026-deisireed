import { RefreshTokenModel } from '../../../shared/database/models/refresh-token.model';

export class AuthRepository {
  async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshTokenModel> {
    return RefreshTokenModel.create({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      is_revoked: false,
    });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenModel | null> {
    return RefreshTokenModel.findOne({ where: { token_hash: tokenHash, is_revoked: false } });
  }

  async revokeRefreshToken(tokenHash: string): Promise<number> {
    const [affected] = await RefreshTokenModel.update({ is_revoked: true }, { where: { token_hash: tokenHash } });
    return affected;
  }
}
