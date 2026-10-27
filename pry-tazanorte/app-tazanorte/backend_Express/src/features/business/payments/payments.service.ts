import {
  CreatePaymentDto,
  PatchPaymentDto,
  PaymentResponseDto,
  UpdatePaymentDto,
  toPaymentResponse,
} from "./dto";
import { PaymentsRepository } from "./payments.repository";
import {
  PAYMENT_METHODS,
  PAYMENT_REFERENCE_TYPES,
  PAYMENT_STATES,
  Payment,
} from "./payment.model";
import { OrdersRepository } from "../orders/orders.repository";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Payments.
 *
 * Reglas de negocio:
 *  - `referencia_tipo` hoy solo admite `PEDIDO`, y `referencia_id` debe ser un
 *    pedido existente que no esté `cancelado`.
 *  - `metodo` y `estado` pertenecen a su catálogo (ver `payment.model.ts`).
 *  - `monto` > 0.
 *  - `is_active` solo cambia con el borrado lógico.
 */
export class PaymentsService {
  public constructor(
    private readonly repository: PaymentsRepository = new PaymentsRepository(),
    private readonly ordersRepository: OrdersRepository = new OrdersRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.repository.findAllActive();
    return payments.map((payment) => toPaymentResponse(payment));
  }

  public async getOne(id: number): Promise<PaymentResponseDto> {
    return toPaymentResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreatePaymentDto): Promise<PaymentResponseDto> {
    if (
      body.referencia_tipo === undefined ||
      body.referencia_id === undefined ||
      body.metodo === undefined ||
      body.monto === undefined
    ) {
      throw new AppError(400, "referencia_tipo, referencia_id, metodo and monto are required");
    }
    await this.validate(body);

    // Copia campo a campo a propósito (evita *mass assignment*).
    const payment = await this.repository.create({
      referencia_tipo: body.referencia_tipo,
      referencia_id: body.referencia_id,
      metodo: body.metodo,
      monto: body.monto,
      fecha: body.fecha ?? new Date(),
      estado: body.estado ?? "PENDIENTE",
      is_active: body.is_active ?? true,
    });
    return toPaymentResponse(payment);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.findOrFail(id);
    await this.validate(body);

    await this.repository.update(payment, {
      referencia_tipo: body.referencia_tipo,
      referencia_id: body.referencia_id,
      metodo: body.metodo,
      monto: body.monto,
      fecha: body.fecha,
      estado: body.estado,
    });
    return toPaymentResponse(payment);
  }

  public async updatePatch(id: number, body: PatchPaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.findOrFail(id);
    // La referencia se valida completa aunque solo llegue una de sus dos partes.
    await this.validate({
      ...body,
      referencia_tipo: body.referencia_tipo ?? payment.referencia_tipo,
      referencia_id: body.referencia_id ?? payment.referencia_id,
    });

    // Solo campos permitidos por el DTO (nunca `is_active`).
    await this.repository.update(payment, {
      ...(body.referencia_tipo !== undefined && { referencia_tipo: body.referencia_tipo }),
      ...(body.referencia_id !== undefined && { referencia_id: body.referencia_id }),
      ...(body.metodo !== undefined && { metodo: body.metodo }),
      ...(body.monto !== undefined && { monto: body.monto }),
      ...(body.fecha !== undefined && { fecha: body.fecha }),
      ...(body.estado !== undefined && { estado: body.estado }),
    });
    return toPaymentResponse(payment);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    // `onlyActive: false` -> también permite purgar un registro ya desactivado.
    const payment = await this.findOrFail(id, false);
    await this.repository.delete(payment);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<PaymentResponseDto> {
    const payment = await this.findOrFail(id);

    await this.repository.update(payment, { is_active: false });
    return toPaymentResponse(payment);
  }

  // ================== HELPERS ==================
  /** Busca por PK y falla con 404. `onlyActive` aplica la política de borrado lógico. */
  private async findOrFail(id: number, onlyActive = true): Promise<Payment> {
    const payment = await this.repository.findById(id);
    if (!payment || (onlyActive && !payment.is_active)) {
      throw new AppError(404, "Payment not found");
    }
    return payment;
  }

  /** Valida los campos presentes (catálogos, monto, fecha y la referencia al pedido). */
  private async validate(body: PatchPaymentDto): Promise<void> {
    if (
      body.referencia_tipo !== undefined &&
      !PAYMENT_REFERENCE_TYPES.includes(body.referencia_tipo)
    ) {
      throw new AppError(400, `referencia_tipo must be one of: ${PAYMENT_REFERENCE_TYPES.join(", ")}`);
    }
    if (body.metodo !== undefined && !PAYMENT_METHODS.includes(body.metodo)) {
      throw new AppError(400, `metodo must be one of: ${PAYMENT_METHODS.join(", ")}`);
    }
    if (body.estado !== undefined && !PAYMENT_STATES.includes(body.estado)) {
      throw new AppError(400, `estado must be one of: ${PAYMENT_STATES.join(", ")}`);
    }
    if (
      body.monto !== undefined &&
      (typeof body.monto !== "number" || !Number.isFinite(body.monto) || body.monto <= 0)
    ) {
      throw new AppError(400, "monto must be a number greater than 0");
    }
    if (body.fecha !== undefined && Number.isNaN(new Date(body.fecha).getTime())) {
      throw new AppError(400, "fecha is not a valid date");
    }
    if (body.referencia_id !== undefined) {
      if (!Number.isInteger(body.referencia_id) || body.referencia_id < 1) {
        throw new AppError(400, "referencia_id must be a positive integer");
      }
      const order = await this.ordersRepository.findById(body.referencia_id);
      if (!order) {
        throw new AppError(404, "Order (referencia_id) not found");
      }
      if (order.estado === "cancelado") {
        throw new AppError(400, "Cannot register a payment for a cancelled order");
      }
    }
  }
}
