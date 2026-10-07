import { Product, ProductI } from "../product.model";

/**
 * Respuesta HTTP de un producto. `precio` siempre sale como número: MySQL
 * devuelve los DECIMAL como texto y el mapper es el único lugar donde se
 * normaliza.
 */
export type ProductResponseDto = ProductI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toProductResponse(product: Product): ProductResponseDto {
  const data = product.toJSON() as ProductI;
  return { ...data, precio: Number(data.precio) };
}
