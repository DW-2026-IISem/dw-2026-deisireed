import { ResourceRoleModel } from '../../../shared/database/models/resource-role.model';
import { AssignResourceRoleDto } from '../dto/resource-role.dto';

export class ResourceRoleRepository {
  async assign(data: AssignResourceRoleDto): Promise<ResourceRoleModel> {
    return ResourceRoleModel.create({ role_id: data.role_id, resource_id: data.resource_id });
  }
  async remove(data: AssignResourceRoleDto): Promise<number> {
    return ResourceRoleModel.destroy({ where: { role_id: data.role_id, resource_id: data.resource_id } });
  }
}
