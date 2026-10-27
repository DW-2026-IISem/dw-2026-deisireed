import { CreationAttributes, Transaction } from "sequelize";
import { ResourceRole, ResourceRoleI } from "./resource-role.model";
import { Role } from "../roles/role.model";
import { Resource } from "../resources/resource.model";
import { RoleUser } from "../role-users/role-user.model";
import { EffectivePermissionDto } from "./dto";

/** Resumen que acompaña a cada concesión. */
const SUMMARIES = [
  { model: Role, as: "role", attributes: ["id", "name"] },
  { model: Resource, as: "resource", attributes: ["id", "method", "path", "description"] },
];

/**
 * Capa Repository del feature ResourceRoles (concesión Role ↔ Resource = permiso).
 * Única que habla con Sequelize (el modelo `ResourceRole`).
 */
export class ResourceRolesRepository {
  // ================== READ ==================
  /** Concesiones activas filtradas por rol y/o recurso. */
  public async findAllActiveFiltered(filters: { role_id?: number; resource_id?: number }): Promise<ResourceRole[]> {
    const where: Record<string, unknown> = { status: "active" };
    if (filters.role_id) where.role_id = filters.role_id;
    if (filters.resource_id) where.resource_id = filters.resource_id;
    return ResourceRole.findAll({ where, include: SUMMARIES, order: [["id", "ASC"]] });
  }

  /** Una concesión por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<ResourceRole | null> {
    return ResourceRole.findByPk(id, { include: SUMMARIES, transaction });
  }

  /** La concesión de un recurso a un rol, sea cual sea su estado. */
  public async findByRoleAndResource(roleId: number, resourceId: number): Promise<ResourceRole | null> {
    return ResourceRole.findOne({ where: { role_id: roleId, resource_id: resourceId } });
  }

  /** Todas las concesiones (activas e inactivas) de un rol. */
  public async findAllByRole(roleId: number, transaction?: Transaction): Promise<ResourceRole[]> {
    return ResourceRole.findAll({ where: { role_id: roleId }, transaction });
  }

  /**
   * **CONSULTA DE AUTORIZACIÓN EFECTIVA.**
   *
   * Devuelve los recursos que un usuario puede ejecutar, recorriendo la cadena y
   * exigiendo `status = 'active'` en **los cuatro eslabones**:
   *
   * ```sql
   * resource_roles (rr)  -> rr.status = active
   *   JOIN roles (ro)     -> ro.status = active
   *   JOIN role_users(ru) -> ru.status = active AND ru.user_id = :userId
   *   JOIN resources (r)  -> r.status  = active
   * ```
   *
   * Si cualquier eslabón está inactivo o ausente, la fila no aparece: el
   * resultado vacío se traduce en **deny by default** en el middleware.
   * Los `include` con `required: true` producen INNER JOIN.
   */
  public async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    const rows = await ResourceRole.findAll({
      where: { status: "active" },
      attributes: ["id"],
      include: [
        {
          model: Role,
          as: "role",
          required: true,
          attributes: ["id", "name"],
          where: { status: "active" },
          include: [
            {
              model: RoleUser,
              as: "role_users",
              required: true,
              attributes: [],
              where: { status: "active", user_id: userId },
            },
          ],
        },
        {
          model: Resource,
          as: "resource",
          required: true,
          attributes: ["id", "method", "path", "description"],
          where: { status: "active" },
        },
      ],
      order: [["id", "ASC"]],
    });

    return rows.map((row) => {
      const plain = row.toJSON() as unknown as {
        role: { id: number; name: string };
        resource: { id: number; method: string; path: string; description: string | null };
      };
      return {
        resource_id: plain.resource.id,
        method: plain.resource.method,
        path: plain.resource.path,
        description: plain.resource.description,
        role_id: plain.role.id,
        role_name: plain.role.name,
      };
    });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<ResourceRole>, transaction?: Transaction): Promise<ResourceRole> {
    return ResourceRole.create(data, { transaction });
  }

  // ================== UPDATE ==================
  public async update(
    resourceRole: ResourceRole,
    data: Partial<ResourceRoleI>,
    transaction?: Transaction
  ): Promise<ResourceRole> {
    return resourceRole.update(data, { transaction });
  }
}
