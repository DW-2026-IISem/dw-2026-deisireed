import { ResourceRoleRepository } from '../repositories/resource-role.repository';
import { AssignResourceRoleDto } from '../dto/resource-role.dto';

export class ResourceRoleService {
  private repo = new ResourceRoleRepository();

  async assignResource(dto: AssignResourceRoleDto) { return this.repo.assign(dto); }
  async removeResource(dto: AssignResourceRoleDto) { return this.repo.remove(dto); }
}
