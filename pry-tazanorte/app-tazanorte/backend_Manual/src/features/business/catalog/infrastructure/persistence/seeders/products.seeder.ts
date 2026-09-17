import { ProductModel } from '../models/product.model';

export async function seedProducts(): Promise<void> {
  await ProductModel.bulkCreate([
    {
      sku: 'CAF-AME-001',
      name: 'Café Americano',
      description: 'Café negro tradicional preparado al instante',
      price: 2.5,
      isActive: true,
    },
    {
      sku: 'CAF-CAP-002',
      name: 'Cappuccino',
      description: 'Espresso con leche al vapor y abundante espuma',
      price: 3.5,
      isActive: true,
    },
  ]);
}
