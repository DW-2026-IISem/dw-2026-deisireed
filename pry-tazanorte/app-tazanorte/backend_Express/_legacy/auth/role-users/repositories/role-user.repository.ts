import { RoleUserModel } from '../../../shared/database/models/role-user.model';
import { AssignRoleUserDto } from '../dto/role-user.dto';

export class RoleUserRepository {
  async assign(data: AssignRoleUserDto): Promise<RoleUserModel> {
    return RoleUserModel.create({ user_id: data.user_id, role_id: data.role_id });
  }
  async remove(data: AssignRoleUserDto): Promise<number> {
    return RoleUserModel.destroy({ where: { user_id: data.user_id, role_id: data.role_id } });
  }
}
