import { SaleModel } from '../models/sale.model';
import { ProductSaleModel } from '../models/product-sale.model';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model';
import { Status } from '../../../../../../common/enums/status.enum';

export async function seedSales(): Promise<void> {
  const count = await SaleModel.count();
  if (count > 0) {
    return;
  }

  const clientCount = await ClientModel.count();
  const productCount = await ProductModel.count();

  if (clientCount === 0 || productCount === 0) {
    return;
  }

  const product = await ProductModel.findByPk(1);
  if (!product) {
    return;
  }

  const quantity = 1;
  const rawPrice = (product as any).unitPrice ?? (product as any).price ?? 0;
  const unitPrice = Number(rawPrice);
  const subtotal = quantity * unitPrice;
  const tax = Math.round(subtotal * 0.19);
  const discounts = 0;
  const total = subtotal + tax - discounts;

  const sequelize = SaleModel.sequelize!;

  await sequelize.transaction(async (transaction) => {
    const sale = await SaleModel.create(
      {
        saleDate: new Date(),
        subtotal,
        tax,
        discounts,
        total,
        status: Status.ACTIVE,
        clientId: 1,
      },
      { transaction },
    );

    await ProductSaleModel.create(
      {
        saleId: sale.id,
        productId: product.id,
        quantity,
        unitPrice,
        total: subtotal,
      },
      { transaction },
    );

    const currentStock = (product as any).stock ?? (product as any).quantity ?? 0;
    const updatedValue = currentStock - quantity;
    const updateData = (product as any).stock !== undefined 
      ? { stock: updatedValue } 
      : { quantity: updatedValue };

    await product.update(updateData, { transaction });
  });
}
