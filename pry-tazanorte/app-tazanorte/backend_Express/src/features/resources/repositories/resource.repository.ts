import { ResourceModel } from '../../../shared/database/models/resource.model';
import { CreateResourceDto } from '../dto/resource.dto';

export class ResourceRepository {
  async create(data: CreateResourceDto): Promise<ResourceModel> {
    return ResourceModel.create({ method: data.method.toUpperCase(), path: data.path, description: data.description });
  }
  async findAll(): Promise<ResourceModel[]> { return ResourceModel.findAll(); }
  async findById(id: string): Promise<ResourceModel | null> { return ResourceModel.findByPk(id); }
}
