import { Transaction } from "sequelize";
import {
  CreateLoyaltyPointDto,
  LoyaltyBalanceDto,
  LoyaltyPointResponseDto,
  PatchLoyaltyPointDto,
  UpdateLoyaltyPointDto,
  toLoyaltyPointResponse,
} from "./dto";
import { LoyaltyPointsRepository } from "./loyalty-points.repository";
import { LoyaltyPoint, ORDER_STATES_THAT_EARN, PESOS_PER_POINT } from "./loyalty-point.model";
import { ClientsRepository } from "../clients/clients.repository";
import { OrdersRepository } from "../orders/orders.repository";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/**
 * Capa Service del feature LoyaltyPoints (MovimientoPuntos).
 *
 * Reglas de negocio:
 *  - El cliente debe existir (404) y estar activo (400).
 *  - **Acumulación**: solo sobre un pedido del mismo cliente en estado
 *    `pagado`, `en_preparacion` o `entregado`; la `cantidad` la calcula el
 *    backend (1 punto por cada $1.000 del total) y un pedido acumula una sola
 *    vez (409).
 *  - **Redención**: la `cantidad` no puede superar el saldo disponible (400).
 *  - El historial no se edita: solo `observaciones`. Anular una acumulación
 *    no puede dejar el saldo en negativo (409).
 */
export class LoyaltyPointsService {
  public constructor(
    private readonly repository: LoyaltyPointsRepository = new LoyaltyPointsRepository(),
    private readonly clientsRepository: ClientsRepository = new ClientsRepository(),
    private readonly ordersRepository: OrdersRepository = new OrdersRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<LoyaltyPointResponseDto[]> {
    const points = await this.repository.findAllActive();
    return points.map((point) => toLoyaltyPointResponse(point));
  }

  public async getOne(id: number): Promise<LoyaltyPointResponseDto> {
    return toLoyaltyPointResponse(await this.findOrFail(id));
  }

  /** Saldo del cliente: Σ acumulaciones activas − Σ redenciones activas. */
  public async getBalance(cliente_id: number): Promise<LoyaltyBalanceDto> {
    await this.assertActiveClient(cliente_id);
    return this.computeBalance(cliente_id);
  }

  // ================== CREATE ==================
  public async create(body: CreateLoyaltyPointDto): Promise<LoyaltyPointResponseDto> {
    if (!body.cliente_id || (body.tipo !== "acumulacion" && body.tipo !== "redencion")) {
      throw new AppError(400, "cliente_id and tipo ('acumulacion' | 'redencion') are required");
    }

    return withTransaction(async (t) => {
      await this.assertActiveClient(body.cliente_id, t);

      const cantidad =
        body.tipo === "acumulacion"
          ? await this.pointsForOrder(body, t)
          : await this.assertRedeemable(body, t);

      // Copia campo a campo a propósito (evita *mass assignment*).
      const point = await this.repository.create(
        {
          cliente_id: body.cliente_id,
          pedido_id: body.tipo === "acumulacion" ? body.pedido_id : null,
          tipo: body.tipo,
          cantidad,
          fecha: new Date(),
          observaciones: body.observaciones ?? null,
          is_active: body.is_active ?? true,
        },
        t
      );
      return toLoyaltyPointResponse(point);
    });
  }

  // ================== UPDATE ==================
  /** Solo `observaciones`: el resto del movimiento es historial. */
  public async updatePut(id: number, body: UpdateLoyaltyPointDto): Promise<LoyaltyPointResponseDto> {
    const point = await this.findOrFail(id);

    await this.repository.update(point, { observaciones: body.observaciones ?? null });
    return toLoyaltyPointResponse(point);
  }

  public async updatePatch(id: number, body: PatchLoyaltyPointDto): Promise<LoyaltyPointResponseDto> {
    const point = await this.findOrFail(id);

    await this.repository.update(point, {
      ...(body.observaciones !== undefined && { observaciones: body.observaciones }),
    });
    return toLoyaltyPointResponse(point);
  }

  // ================== DELETE ==================
  /** Eliminación física (misma regla de saldo que la anulación). */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      // `onlyActive: false` -> también permite purgar un registro ya anulado.
      const point = await this.findOrFail(id, false, t);
      if (point.is_active) {
        await this.assertCanRemove(point, t);
      }
      await this.repository.delete(point, t);
    });
  }

  /** Eliminación lógica = anular el movimiento (`is_active = false`). */
  public async deleteLogical(id: number): Promise<LoyaltyPointResponseDto> {
    return withTransaction(async (t) => {
      const point = await this.findOrFail(id, true, t);
      await this.assertCanRemove(point, t);

      await this.repository.update(point, { is_active: false }, t);
      return toLoyaltyPointResponse(point);
    });
  }

  // ================== HELPERS ==================
  /** Busca por PK y falla con 404. `onlyActive` aplica la política de borrado lógico. */
  private async findOrFail(id: number, onlyActive = true, t?: Transaction): Promise<LoyaltyPoint> {
    const point = await this.repository.findById(id, t);
    if (!point || (onlyActive && !point.is_active)) {
      throw new AppError(404, "Loyalty movement not found");
    }
    return point;
  }

  private async assertActiveClient(cliente_id: number, t?: Transaction): Promise<void> {
    const client = await this.clientsRepository.findById(cliente_id, t);
    if (!client) {
      throw new AppError(404, "Client not found");
    }
    if (!client.is_active) {
      throw new AppError(400, "Client must be active");
    }
  }

  private async computeBalance(cliente_id: number, t?: Transaction): Promise<LoyaltyBalanceDto> {
    const acumulados = await this.repository.sumActive(cliente_id, "acumulacion", t);
    const redimidos = await this.repository.sumActive(cliente_id, "redencion", t);
    return { cliente_id, acumulados, redimidos, saldo: acumulados - redimidos };
  }

  /** Acumulación: valida el pedido y devuelve los puntos que genera. */
  private async pointsForOrder(body: CreateLoyaltyPointDto, t: Transaction): Promise<number> {
    if (!body.pedido_id) {
      throw new AppError(400, "pedido_id is required for an 'acumulacion'");
    }

    const order = await this.ordersRepository.findById(body.pedido_id, t);
    if (!order) {
      throw new AppError(404, "Order (pedido_id) not found");
    }
    if (order.cliente_id !== body.cliente_id) {
      throw new AppError(400, "The order does not belong to this client");
    }
    if (!(ORDER_STATES_THAT_EARN as readonly string[]).includes(order.estado)) {
      throw new AppError(
        400,
        `Only paid orders earn points (estado: ${ORDER_STATES_THAT_EARN.join(", ")}; current: ${order.estado})`
      );
    }

    const already = await this.repository.findActiveAccumulationByOrder(order.id, t);
    if (already) {
      throw new AppError(409, "Points for this order were already accumulated");
    }

    const cantidad = Math.floor(Number(order.total) / PESOS_PER_POINT);
    if (cantidad < 1) {
      throw new AppError(400, `Order total is too low to earn points (1 point per $${PESOS_PER_POINT})`);
    }
    return cantidad;
  }

  /** Redención: valida la cantidad contra el saldo y la devuelve. */
  private async assertRedeemable(body: CreateLoyaltyPointDto, t: Transaction): Promise<number> {
    const cantidad = body.cantidad;
    if (cantidad === undefined || !Number.isInteger(cantidad) || cantidad < 1) {
      throw new AppError(400, "cantidad (integer >= 1) is required for a 'redencion'");
    }

    const { saldo } = await this.computeBalance(body.cliente_id, t);
    if (cantidad > saldo) {
      throw new AppError(400, `Insufficient points: requested ${cantidad}, available ${saldo}`);
    }
    return cantidad;
  }

  /** Anular/borrar una acumulación activa no puede dejar el saldo negativo. */
  private async assertCanRemove(point: LoyaltyPoint, t: Transaction): Promise<void> {
    if (point.tipo !== "acumulacion") return;

    const { saldo } = await this.computeBalance(point.cliente_id, t);
    if (saldo - point.cantidad < 0) {
      throw new AppError(409, "Cannot remove this accumulation: its points were already redeemed");
    }
  }
}
