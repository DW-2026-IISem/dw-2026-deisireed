import { ResourceRepository } from '../repositories/resource.repository';
import { CreateResourceDto, ResourceResponseDto } from '../dto/resource.dto';

export class ResourceService {
  private repo = new ResourceRepository();

  async create(dto: CreateResourceDto): Promise<ResourceResponseDto> {
    return this.map(await this.repo.create(dto));
  }
  async findAll(): Promise<ResourceResponseDto[]> { return (await this.repo.findAll()).map((r) => this.map(r)); }
  async findById(id: string): Promise<ResourceResponseDto> {
    const resource = await this.repo.findById(id);
    if (!resource) throw new Error('Recurso no encontrado.');
    return this.map(resource);
  }
  private map(r: any): ResourceResponseDto {
    return { id: r.id, method: r.method, path: r.path, description: r.description, createdAt: r.createdAt };
  }
}
