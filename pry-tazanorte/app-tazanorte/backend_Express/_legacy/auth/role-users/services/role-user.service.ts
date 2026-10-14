import { RoleUserRepository } from '../repositories/role-user.repository';
import { AssignRoleUserDto } from '../dto/role-user.dto';

export class RoleUserService {
  private repo = new RoleUserRepository();

  async assignRole(dto: AssignRoleUserDto) { return this.repo.assign(dto); }
  async removeRole(dto: AssignRoleUserDto) { return this.repo.remove(dto); }
}
