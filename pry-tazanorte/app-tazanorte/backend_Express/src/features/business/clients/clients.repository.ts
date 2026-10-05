import { CreationAttributes, Op, Transaction } from "sequelize";
import { Client, ClientI } from "./client.model";

/**
 * Capa Repository del feature Clients.
 * Única responsable de hablar con Sequelize (el modelo `Client`).
 */
export class ClientsRepository {
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

  /** Inserta un cliente. */
  public async create(data: CreationAttributes<Client>): Promise<Client> {
    return Client.create(data);
  }

  /** Persiste cambios sobre una instancia existente. */
  public async update(client: Client, data: Partial<ClientI>): Promise<Client> {
    return client.update(data);
  }

  /** Elimina físicamente una instancia. */
  public async delete(client: Client): Promise<void> {
    await client.destroy();
  }
}
