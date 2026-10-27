/** Respuesta de `GET /api/puntos-fidelizacion/cliente/:id/saldo`. */
export interface LoyaltyBalanceDto {
  cliente_id: number;
  acumulados: number;
  redimidos: number;
  saldo: number;
}
