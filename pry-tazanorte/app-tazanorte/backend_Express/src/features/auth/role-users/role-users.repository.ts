import { CreationAttributes, Transaction } from "sequelize";
import { RoleUser, RoleUserI } from "./role-user.model";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";

/** Resumen que acompaña a cada asignación (nunca el `password` del usuario). */
const SUMMARIES = [
  { model: User, as: "user", attributes: ["id", "username", "email"] },
  { model: Role, as: "role", attributes: ["id", "name"] },
];

/**
 * Capa Repository del feature RoleUsers (asignación N:M User ↔ Role).
 * Única que habla con Sequelize (el modelo `RoleUser`).
 */
export class RoleUsersRepository {
  // ================== READ ==================
  /** Asignaciones activas (con resumen de usuario y rol). */
  public async findAllActive(): Promise<RoleUser[]> {
    return RoleUser.findAll({ where: { status: "active" }, include: SUMMARIES, order: [["id", "ASC"]] });
  }

  /** Una asignación por PK (o `null`). */
  public async findById(id: number, transaction?: Transaction): Promise<RoleUser | null> {
    return RoleUser.findByPk(id, { include: SUMMARIES, transaction });
  }

  /**
   * La asignación de un usuario a un rol, sea cual sea su estado.
   *
   * Permite la semántica *create-or-reactivate*: si ya existe inactiva, se
   * reactiva en lugar de chocar con la restricción única `(user_id, role_id)`.
   */
  public async findByUserAndRole(userId: number, roleId: number): Promise<RoleUser | null> {
    return RoleUser.findOne({ where: { user_id: userId, role_id: roleId } });
  }

  // ================== CREATE ==================
  public async create(data: CreationAttributes<RoleUser>): Promise<RoleUser> {
    return RoleUser.create(data);
  }

  // ================== UPDATE ==================
  public async update(roleUser: RoleUser, data: Partial<RoleUserI>): Promise<RoleUser> {
    return roleUser.update(data);
  }
}
