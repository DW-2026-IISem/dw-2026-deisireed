import { LoyaltyPoint } from "./loyalty-point.model";
import { Client } from "../clients/client.model";
import { Order } from "../orders/order.model";

// Cliente 1:N MovimientoPuntos
LoyaltyPoint.belongsTo(Client, { foreignKey: "cliente_id", as: "cliente" });
Client.hasMany(LoyaltyPoint, { foreignKey: "cliente_id", as: "movimientos_puntos" });

// Pedido 1:N MovimientoPuntos (solo las acumulaciones apuntan a un pedido)
LoyaltyPoint.belongsTo(Order, { foreignKey: "pedido_id", as: "pedido" });
Order.hasMany(LoyaltyPoint, { foreignKey: "pedido_id", as: "movimientos_puntos" });
