import { CreationAttributes, Op, Transaction } from "sequelize";
import { Client } from "./client.model";

/**
 * Capa Repository del feature Clients.
 * Única responsable de hablar con Sequelize (el modelo `Client`).
 */
export class ClientsRepository {
  // ================== READ ==================
  /** Todos los clientes activos. */
  public async findAllActive(): Promise<Client[]> {
    return Client.findAll({ where: { is_active: true } });
  }

  /** Un cliente por PK (o `null`). Acepta transacción para flujos de pedidos. */
  public async findById(id: number, transaction?: Transaction): Promise<Client | null> {
    return Client.findByPk(id, { transaction });
  }

  /** Un cliente por número de documento, opcionalmente excluyendo un id. */
  public async findByDocument(
    numero_documento: string,
    excludeId?: number
  ): Promise<Client | null> {
    return Client.findOne({
      where: {
        numero_documento,
        ...(excludeId !== undefined ? { id: { [Op.ne]: excludeId } } : {}),
      },
    });
  }

  // ================== CREATE ==================
  /** Inserta un cliente. */
  public async create(data: CreationAttributes<Client>): Promise<Client> {
    return Client.create(data);
  }

  // ================== UPDATE ==================
  // (rellenar en ISS-03-D) update

  // ================== DELETE ==================
  // (rellenar en ISS-03-E) delete
}
