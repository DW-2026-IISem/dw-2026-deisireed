import { AuthRepository } from '../repositories/auth.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { LoginDto, RefreshTokenDto, AuthResponseDto } from '../dto/auth.dto';
import { PasswordHasher } from '../../../shared/auth/password';
import { JwtService } from '../../../shared/auth/jwt';

export class AuthService {
  private authRepo = new AuthRepository();
  private userRepo = new UserRepository();

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.is_active) {
      throw new Error('Credenciales inválidas o usuario inactivo.');
    }

    const isValid = await PasswordHasher.compare(dto.password, user.password_hash);
    if (!isValid) {
      throw new Error('Credenciales inválidas.');
    }

    const roles = user.roles ? user.roles.map((r) => r.name) : [];
    const access_token = JwtService.signAccessToken({ sub: user.id, email: user.email, roles });

    const rawRefreshToken = PasswordHasher.generateOpaqueToken();
    const refreshHash = PasswordHasher.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authRepo.saveRefreshToken(user.id, refreshHash, expiresAt);

    return {
      access_token,
      refresh_token: rawRefreshToken,
      user: { id: user.id, name: user.name, email: user.email, roles },
    };
  }

  async refresh(dto: RefreshTokenDto): Promise<{ access_token: string; refresh_token: string }> {
    const tokenHash = PasswordHasher.hashToken(dto.refresh_token);
    const tokenRecord = await this.authRepo.findRefreshToken(tokenHash);

    if (!tokenRecord || tokenRecord.expires_at < new Date()) {
      throw new Error('Refresh token inválido o expirado.');
    }

    const user = await this.userRepo.findById(tokenRecord.user_id);
    if (!user || !user.is_active) {
      throw new Error('Usuario no válido o inactivo.');
    }

    await this.authRepo.revokeRefreshToken(tokenHash);

    const roles = user.roles ? user.roles.map((r) => r.name) : [];
    const newAccessToken = JwtService.signAccessToken({ sub: user.id, email: user.email, roles });

    const newRawRefreshToken = PasswordHasher.generateOpaqueToken();
    const newRefreshHash = PasswordHasher.hashToken(newRawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authRepo.saveRefreshToken(user.id, newRefreshHash, expiresAt);

    return { access_token: newAccessToken, refresh_token: newRawRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = PasswordHasher.hashToken(refreshToken);
    await this.authRepo.revokeRefreshToken(tokenHash);
  }
}
