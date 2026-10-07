import { Payment } from "./payment.model";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

export class PaymentsRepository {
  public async findAll(): Promise<Payment[]> {
    return await Payment.findAll();
  }

  public async findById(id: number): Promise<Payment | null> {
    return await Payment.findByPk(id);
  }

  public async create(data: CreatePaymentDto): Promise<Payment> {
    return await Payment.create(data as any);
  }

  public async update(id: number, data: UpdatePaymentDto): Promise<[number]> {
    return await Payment.update(data, { where: { id } });
  }

  public async delete(id: number): Promise<number> {
    return await Payment.destroy({ where: { id } });
  }
}
