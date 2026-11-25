/**
 * Imagen y descripción de producto SOLO en el frontend (el backend no tiene esos campos).
 * La foto se busca en /public/productos/<slug>.jpg, donde slug sale del nombre:
 *   "Té chai" → te-chai.jpg · "Sándwich de pollo" → sandwich-de-pollo.jpg
 * Si no existe, se muestra /productos/default.svg.
 */
export const DEFAULT_PRODUCT_IMAGE = '/productos/default.svg';

/** Descripciones de la carta (la BD del seeder trae texto de relleno). */
const MENU_INFO: Record<string, string> = {
  espresso: 'Café concentrado de tueste oscuro, intenso y con crema dorada. 30 ml.',
  americano: 'Espresso alargado con agua caliente, suave y aromático. 240 ml.',
  capuchino: '1/3 espresso, 1/3 leche vaporizada y 1/3 espuma cremosa.',
  latte: 'Espresso con abundante leche vaporizada y una fina capa de espuma.',
  moca: 'Espresso, chocolate y leche vaporizada con un toque de cacao.',
  'te-chai': 'Té negro con canela, cardamomo y jengibre, con leche espumada.',
  'chocolate-caliente': 'Chocolate de mesa fundido en leche, espeso y reconfortante.',
  croissant: 'Hojaldre de mantequilla horneado cada mañana, crujiente por fuera.',
  'sandwich-de-pollo': 'Pan artesanal con pollo desmechado, lechuga, tomate y salsa de la casa.',
  brownie: 'Bizcocho húmedo de chocolate con trozos de nuez.',
};

export function productSlug(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function productImage(nombre: string): string {
  return `/productos/${productSlug(nombre)}.jpg`;
}

/** Descripción de la carta; si el producto no está en ella, la de la BD. */
export function productDescription(product: { nombre: string; descripcion?: string | null }): string {
  return MENU_INFO[productSlug(product.nombre)] ?? product.descripcion ?? '';
}

/** (error) de <img>: cambia a la imagen por defecto una sola vez. */
export function useDefaultImage(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (!img.src.endsWith(DEFAULT_PRODUCT_IMAGE)) {
    img.src = DEFAULT_PRODUCT_IMAGE;
  }
}
