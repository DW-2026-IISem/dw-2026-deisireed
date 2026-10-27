import { CreationAttributes, Transaction } from "sequelize";
import { Resource, ResourceI } from "./resource.model";
import { normalizePath } from "../../../shared/auth/resource-match";

/**
 * Capa Repository del feature Resources.
 * Única que habla con Sequelize (el modelo `Resource`).
 */
export class ResourcesRepository {
  // ================== READ ==================
  /** Todos los recursos activos (ordenados por ruta y verbo). */
  public async findAllActive(): Promise<Resource[]> {
    return Resource.findAll({ where: { status: "active" }, order: [["path", "ASC"], ["method", "ASC"]] });
  }

  /** Un recurso por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<Resource | null> {
    return Resource.findByPk(id, { transaction });
  }

  /** Un recurso por su par `(method, path)` (o `null`). */
  public async findByOperation(method: string, path: string): Promise<Resource | null> {
    return Resource.findOne({
      where: { method: method.trim().toUpperCase(), path: normalizePath(path.trim()) },
    });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<Resource>): Promise<Resource> {
    return Resource.create(data);
  }

  // ================== UPDATE ==================
  public async update(resource: Resource, data: Partial<ResourceI>): Promise<Resource> {
    return resource.update(data);
  }

  // ================== DELETE ==================
  public async delete(resource: Resource): Promise<void> {
    await resource.destroy();
  }
}
