import { OrderModel } from '../models/order.model';
import { Status } from '../../../../../../common/enums/status.enum';

export async function seedOrders(): Promise<void> {
  const count = await OrderModel.count();
  if (count > 0) {
    return;
  }

  await OrderModel.bulkCreate([
    {
      clienteId: 1,
      origenId: 1,
      canal: 'CAJA',
      fecha: new Date(),
      subtotal: 15.5,
      total: 15.5,
      estado: 'PENDING',
      status: Status.ACTIVE,
    },
  ]);
}
