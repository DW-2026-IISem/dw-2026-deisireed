import {
  ClientResponseDto,
  CreateClientDto,
  PatchClientDto,
  UpdateClientDto,
  toClientResponse,
} from "./dto";
import { ClientsRepository } from "./clients.repository";
import { Client } from "./client.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Clients.
 * Reglas de negocio: default de `is_active`, documento único, política de
 * borrado lógico y borrado físico. Devuelve **DTOs**, nunca instancias del modelo.
 */
export class ClientsService {
  public constructor(
    private readonly repository: ClientsRepository = new ClientsRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ClientResponseDto[]> {
    const clients = await this.repository.findAllActive();
    return clients.map((client) => toClientResponse(client));
  }

  public async getOne(id: number): Promise<ClientResponseDto> {
    return toClientResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateClientDto): Promise<ClientResponseDto> {
    await this.assertUniqueDocument(body.numero_documento);

    // Copia campo a campo a propósito (evita *mass assignment*).
    const client = await this.repository.create({
      tipo_documento: body.tipo_documento,
      numero_documento: body.numero_documento,
      nombre: body.nombre,
      telefono: body.telefono ?? null,
      email: body.email ?? null,
      is_active: body.is_active ?? true,
    });
    return toClientResponse(client);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateClientDto): Promise<ClientResponseDto> {
    const client = await this.findOrFail(id);
    await this.assertUniqueDocument(body.numero_documento, id);

    await this.repository.update(client, {
      tipo_documento: body.tipo_documento,
      numero_documento: body.numero_documento,
      nombre: body.nombre,
      telefono: body.telefono ?? null,
      email: body.email ?? null,
    });
    return toClientResponse(client);
  }

  public async updatePatch(id: number, body: PatchClientDto): Promise<ClientResponseDto> {
    const client = await this.findOrFail(id);

    if (body.numero_documento !== undefined) {
      await this.assertUniqueDocument(body.numero_documento, id);
    }

    // Se copian solo los campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(client, {
      ...(body.tipo_documento !== undefined && { tipo_documento: body.tipo_documento }),
      ...(body.numero_documento !== undefined && { numero_documento: body.numero_documento }),
      ...(body.nombre !== undefined && { nombre: body.nombre }),
      ...(body.telefono !== undefined && { telefono: body.telefono }),
      ...(body.email !== undefined && { email: body.email }),
    });
    return toClientResponse(client);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const client = await this.findOrFail(id, false);
    await this.repository.delete(client);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<ClientResponseDto> {
    const client = await this.findOrFail(id);

    await this.repository.update(client, { is_active: false });
    return toClientResponse(client);
  }

  // ================== HELPERS ==================
  /**
   * Busca por PK y falla con 404 si no existe.
   * `onlyActive` (por defecto `true`) aplica la política de borrado lógico:
   * un registro inactivo deja de ser visible para la API.
   */
  private async findOrFail(id: number, onlyActive = true): Promise<Client> {
    const client = await this.repository.findById(id);
    if (!client || (onlyActive && !client.is_active)) {
      throw new AppError(404, "Client not found");
    }
    return client;
  }

  /** Regla: no puede haber dos clientes con el mismo `numero_documento`. */
  private async assertUniqueDocument(numero_documento: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByDocument(numero_documento, excludeId);
    if (existing) {
      throw new AppError(409, "A client with this numero_documento already exists");
    }
  }
}
