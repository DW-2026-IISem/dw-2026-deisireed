import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '../dto/role.dto';

export class RoleService {
  private repo = new RoleRepository();

  async create(dto: CreateRoleDto): Promise<RoleResponseDto> {
    if (await this.repo.findByName(dto.name)) throw new Error('El rol ya existe.');
    return this.map(await this.repo.create(dto));
  }
  async findAll(): Promise<RoleResponseDto[]> { return (await this.repo.findAll()).map((r) => this.map(r)); }
  async findById(id: string): Promise<RoleResponseDto> {
    const role = await this.repo.findById(id);
    if (!role) throw new Error('Rol no encontrado.');
    return this.map(role);
  }
  async update(id: string, dto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.repo.findById(id);
    if (!role) throw new Error('Rol no encontrado.');
    const data: any = { ...dto };
    if (dto.name) data.name = dto.name.toUpperCase();
    await this.repo.update(id, data);
    return this.findById(id);
  }
  private map(r: any): RoleResponseDto {
    return { id: r.id, name: r.name, description: r.description, createdAt: r.createdAt };
  }
}
