import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserResponseDto } from '../dto/user.dto';
import { PasswordHasher } from '../../../shared/auth/password';

export class UserService {
  private repo = new UserRepository();

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    if (await this.repo.findByEmail(dto.email)) throw new Error('El correo ya existe.');
    const hash = await PasswordHasher.hash(dto.password);
    return this.map(await this.repo.create(dto, hash));
  }
  async findAll(): Promise<UserResponseDto[]> { return (await this.repo.findAll()).map((u) => this.map(u)); }
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('Usuario no encontrado.');
    return this.map(user);
  }
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('Usuario no encontrado.');
    const data: any = { ...dto };
    if (dto.password) data.password_hash = await PasswordHasher.hash(dto.password);
    if (dto.email) data.email = dto.email.toLowerCase();
    await this.repo.update(id, data);
    return this.findById(id);
  }
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.repo.findById(userId);
    if (!user || !(await PasswordHasher.compare(dto.current_password, user.password_hash))) throw new Error('Credenciales inválidas.');
    await this.repo.update(userId, { password_hash: await PasswordHasher.hash(dto.new_password) });
  }
  async getEffectivePermissions(userId: string) { return this.repo.findEffectivePermissions(userId); }
  private map(u: any): UserResponseDto {
    return { id: u.id, name: u.name, email: u.email, is_active: u.is_active, roles: u.roles?.map((r: any) => r.name) || [], createdAt: u.createdAt, updatedAt: u.updatedAt };
  }
}
