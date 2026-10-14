
import { PaymentsRepository } from "./payments.repository";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

export class PaymentsService {
  private repository: PaymentsRepository;

  constructor() {
    this.repository = new PaymentsRepository();
  }

  public async getAll() {
    return await this.repository.findAll();
  }

  public async getById(id: number) {
    const payment = await this.repository.findById(id);

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    return payment;
  }

  private validatePayment(data: CreatePaymentDto | UpdatePaymentDto, isCreate = false): void {
    if (isCreate) {
      const requiredFields = [
        "referencia_tipo",
        "referencia_id",
        "metodo",
        "monto",
      ] as const;

      for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === "") {
          throw new Error(`El campo ${field} es obligatorio`);
        }
      }
    }

    if ("referencia_tipo" in data && data.referencia_tipo !== undefined) {
      if (typeof data.referencia_tipo !== "string" || !data.referencia_tipo.trim()) {
        throw new Error("referencia_tipo debe ser un texto no vacío");
      }
    }

    if ("referencia_id" in data && data.referencia_id !== undefined) {
      if (!Number.isInteger(data.referencia_id) || data.referencia_id <= 0) {
        throw new Error("referencia_id debe ser un entero positivo");
      }
    }

    if ("metodo" in data && data.metodo !== undefined) {
      if (typeof data.metodo !== "string" || !data.metodo.trim()) {
        throw new Error("metodo debe ser un texto no vacío");
      }
    }

    if ("monto" in data && data.monto !== undefined) {
      if (
        typeof data.monto !== "number" ||
        !Number.isFinite(data.monto) ||
        data.monto <= 0
      ) {
        throw new Error("monto debe ser un número mayor que cero");
      }
    }

    if ("estado" in data && data.estado !== undefined) {
      if (typeof data.estado !== "string" || !data.estado.trim()) {
        throw new Error("estado debe ser un texto no vacío");
      }
    }

    if ("fecha" in data && data.fecha !== undefined) {
      const fecha = new Date(data.fecha);

      if (Number.isNaN(fecha.getTime())) {
        throw new Error("fecha no es válida");
      }
    }
  }

  public async create(data: CreatePaymentDto) {
    this.validatePayment(data, true);
    return await this.repository.create(data);
  }

  public async update(id: number, data: UpdatePaymentDto) {
    await this.getById(id);
    this.validatePayment(data);

    if (Object.keys(data).length === 0) {
      throw new Error("Debes enviar al menos un campo para actualizar");
    }

    await this.repository.update(id, data);
    return await this.repository.findById(id);
  }

  public async delete(id: number) {
    await this.getById(id);
    return await this.repository.delete(id);
  }
}

