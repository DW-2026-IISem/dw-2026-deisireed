import { CreationAttributes, Op, Transaction } from "sequelize";
import { Product, ProductI } from "./product.model";

/**
 * Capa Repository del feature Products.
 * Única responsable de hablar con Sequelize (el modelo `Product`).
 */
export class ProductsRepository {
  // ================== READ ==================
  /** Todos los productos activos. */
  public async findAllActive(): Promise<Product[]> {
    return Product.findAll({ where: { is_active: true } });
  }

  /** Un producto por PK (o `null`). Acepta transacción para flujos de pedidos. */
  public async findById(id: number, transaction?: Transaction): Promise<Product | null> {
    return Product.findByPk(id, { transaction });
  }

  /** Un producto por SKU, opcionalmente excluyendo un id. */
  public async findBySku(sku: string, excludeId?: number): Promise<Product | null> {
    return Product.findOne({
      where: {
        sku,
        ...(excludeId !== undefined ? { id: { [Op.ne]: excludeId } } : {}),
      },
    });
  }

  // ================== CREATE ==================
  /** Inserta un producto. */
  public async create(data: CreationAttributes<Product>): Promise<Product> {
    return Product.create(data);
  }

  // ================== UPDATE ==================
  /** Persiste cambios sobre una instancia existente. */
  public async update(product: Product, data: Partial<ProductI>): Promise<Product> {
    return product.update(data);
  }

  // ================== DELETE ==================
  /** Elimina físicamente una instancia. */
  public async delete(product: Product): Promise<void> {
    await product.destroy();
  }
}
