import {
  CreateResourceDto,
  PatchResourceDto,
  ResourceResponseDto,
  UpdateResourceDto,
  toResourceResponse,
} from "./dto";
import { ResourcesRepository } from "./resources.repository";
import { Resource } from "./resource.model";
import { AppError } from "../../../shared/errors/app-error";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/**
 * Capa Service del feature Resources.
 *
 * Reglas de negocio: `method` es un verbo HTTP válido, `path` empieza por
 * `/api/` y la tupla `(method, path)` es única. Se comprueba antes de escribir
 * para responder 400/409 con un mensaje útil en lugar de un 500.
 */
export class ResourcesService {
  public constructor(
    private readonly repository: ResourcesRepository = new ResourcesRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ResourceResponseDto[]> {
    const resources = await this.repository.findAllActive();
    return resources.map((resource) => toResourceResponse(resource));
  }

  public async getOne(id: number): Promise<ResourceResponseDto> {
    return toResourceResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateResourceDto): Promise<ResourceResponseDto> {
    if (!body.method || !body.path) {
      throw new AppError(400, "method and path are required");
    }
    this.assertValidOperation(body.method, body.path);
    await this.assertOperationAvailable(body.method, body.path);

    // Copia campo a campo (evita *mass assignment*).
    const resource = await this.repository.create({
      method: body.method,
      path: body.path,
      description: body.description ?? null,
      status: body.status ?? "active",
    });
    return toResourceResponse(resource);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    if (!body.method || !body.path) {
      throw new AppError(400, "method and path are required");
    }
    this.assertValidOperation(body.method, body.path);
    await this.assertOperationAvailable(body.method, body.path, id);

    await this.repository.update(resource, {
      method: body.method,
      path: body.path,
      description: body.description ?? null,
    });
    return toResourceResponse(resource);
  }

  public async updatePatch(id: number, body: PatchResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);

    const method = body.method ?? resource.method;
    const path = body.path ?? resource.path;
    this.assertValidOperation(method, path);
    await this.assertOperationAvailable(method, path, id);

    // Solo campos del DTO: un PATCH nunca cambia `status`.
    await this.repository.update(resource, {
      ...(body.method !== undefined && { method: body.method }),
      ...(body.path !== undefined && { path: body.path }),
      ...(body.description !== undefined && { description: body.description }),
    });
    return toResourceResponse(resource);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const resource = await this.findOrFail(id, false);
    await this.repository.delete(resource);
  }

  /** Eliminación lógica -> `status = inactive`. Deshabilita el punto de acceso para todos. */
  public async deleteLogical(id: number): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.repository.update(resource, { status: "inactive" });
    return toResourceResponse(resource);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Resource> {
    const resource = await this.repository.findById(id);
    if (!resource || (onlyActive && resource.status !== "active")) {
      throw new AppError(404, "Resource not found");
    }
    return resource;
  }

  /** 400 si el verbo no es HTTP o la ruta no es de la API. */
  private assertValidOperation(method: string, path: string): void {
    if (!HTTP_METHODS.includes(method.trim().toUpperCase())) {
      throw new AppError(400, `method must be one of: ${HTTP_METHODS.join(", ")}`);
    }
    if (!path.trim().startsWith("/api/")) {
      throw new AppError(400, "path must start with /api/ (e.g. /api/productos/:id)");
    }
  }

  /** 409 si otro recurso ya declara el mismo `(method, path)`. */
  private async assertOperationAvailable(method: string, path: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByOperation(method, path);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, `Resource ${method.toUpperCase()} ${path} already exists`);
    }
  }
}
