import { RoleModel } from '../../../shared/database/models/role.model';
import { CreateRoleDto } from '../dto/role.dto';

export class RoleRepository {
  async create(data: CreateRoleDto): Promise<RoleModel> {
    return RoleModel.create({ name: data.name.toUpperCase(), description: data.description });
  }
  async findAll(): Promise<RoleModel[]> { return RoleModel.findAll(); }
  async findById(id: string): Promise<RoleModel | null> { return RoleModel.findByPk(id); }
  async findByName(name: string): Promise<RoleModel | null> {
    return RoleModel.findOne({ where: { name: name.toUpperCase() } });
  }
  async update(id: string, data: Partial<RoleModel>): Promise<[number]> {
    return RoleModel.update(data, { where: { id } });
  }
}
