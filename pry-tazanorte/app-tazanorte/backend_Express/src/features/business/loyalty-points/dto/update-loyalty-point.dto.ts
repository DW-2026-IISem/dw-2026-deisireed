/**
 * Datos de entrada de `PUT /api/puntos-fidelizacion/:id`.
 *
 * Un movimiento es **historial**: cliente, tipo, pedido y cantidad no se editan
 * (para corregir, se anula con `/deactivate` y se registra otro). Solo se
 * pueden cambiar las observaciones.
 */
export interface UpdateLoyaltyPointDto {
  observaciones: string | null;
}
