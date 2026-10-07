import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateOpaqueToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }
}

export const hashPassword = (password: string) => PasswordHasher.hash(password);
