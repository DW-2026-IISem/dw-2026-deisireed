import { UserModel } from '../../../shared/database/models/user.model';
import { RoleModel } from '../../../shared/database/models/role.model';
import { ResourceModel } from '../../../shared/database/models/resource.model';
import { CreateUserDto } from '../dto/user.dto';

export class UserRepository {
  async create(data: CreateUserDto, password_hash: string): Promise<UserModel> {
    return UserModel.create({ name: data.name, email: data.email.toLowerCase(), password_hash, is_active: data.is_active ?? true });
  }
  async findById(id: string): Promise<UserModel | null> {
    return UserModel.findByPk(id, { include: [{ model: RoleModel, attributes: ['id', 'name'] }] });
  }
  async findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({ where: { email: email.toLowerCase() }, include: [{ model: RoleModel, attributes: ['id', 'name'] }] });
  }
  async findAll(): Promise<UserModel[]> {
    return UserModel.findAll({ attributes: { exclude: ['password_hash'] }, include: [{ model: RoleModel, attributes: ['id', 'name'] }] });
  }
  async update(id: string, data: Partial<UserModel>): Promise<[number]> {
    return UserModel.update(data, { where: { id } });
  }
  async findEffectivePermissions(userId: string): Promise<ResourceModel[]> {
    const user = await UserModel.findByPk(userId, {
      include: [{ model: RoleModel, include: [{ model: ResourceModel, through: { attributes: [] } }], through: { attributes: [] } }],
    });
    if (!user) return [];
    const map = new Map<string, ResourceModel>();
    user.roles?.forEach((r) => r.resources?.forEach((res) => map.set(res.id, res)));
    return Array.from(map.values());
  }
}
