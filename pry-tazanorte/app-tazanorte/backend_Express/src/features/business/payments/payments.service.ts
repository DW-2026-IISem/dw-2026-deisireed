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
    if (!payment) throw new Error("Pago no encontrado");
    return payment;
  }

  public async create(data: CreatePaymentDto) {
    return await this.repository.create(data);
  }

  public async update(id: number, data: UpdatePaymentDto) {
    await this.getById(id);
    await this.repository.update(id, data);
    return await this.repository.findById(id);
  }

  public async delete(id: number) {
    await this.getById(id);
    return await this.repository.delete(id);
  }
}
