import { Client, ClientI } from "../client.model";

/**
 * Respuesta HTTP de un cliente. `Client` no guarda campos sensibles, por eso
 * el contrato coincide con el modelo. Si mañana aparece uno, la proyección se
 * vuelve explícita aquí (`Omit<ClientI, "...">`).
 */
export type ClientResponseDto = ClientI;

/** Mapper modelo -> DTO de respuesta (objeto plano, sin métodos de Sequelize). */
export function toClientResponse(client: Client): ClientResponseDto {
  return client.toJSON() as ClientResponseDto;
}
