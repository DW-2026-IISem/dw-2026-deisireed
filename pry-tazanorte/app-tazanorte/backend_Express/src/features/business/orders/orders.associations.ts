import { Order } from "./order.model";
import { Client } from "../clients/client.model";
import { CashRegister } from "../cash-registers/cash-register.model";

Order.belongsTo(Client, { foreignKey: "cliente_id", as: "cliente" });
Client.hasMany(Order, { foreignKey: "cliente_id", as: "orders" });

Order.belongsTo(CashRegister, { foreignKey: "turno_caja_id", as: "turno_caja" });
CashRegister.hasMany(Order, { foreignKey: "turno_caja_id", as: "orders" });
