import { ProductModel } from '../models/product.model';

export async function seedProducts(): Promise<void> {
  const count = await ProductModel.count();
  if (count > 0) return;

  await ProductModel.bulkCreate([
    {
      sku: 'CAF-001',
      nombre: 'Café Americano 12oz',
      descripcion: 'Café de grano premium',
      precio: 4.5,
      isActive: true,
    },
  ]);
}
