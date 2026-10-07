export interface CreatePaymentDto {
  referencia_tipo: string;
  referencia_id: number;
  metodo: string;
  monto: number;
  fecha?: Date;
  estado?: string;
}
