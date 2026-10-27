import { SupplyOrderItem } from "./supply-order-item.model";
import { OrderItem } from "../order-items/order-item.model";
import { Supply } from "../supplies/supply.model";

// Norma FK: el diagrama de TazaNorte usa nombres en español (`pedido_detalle_id`, `insumo_id`).
SupplyOrderItem.belongsTo(OrderItem, { foreignKey: "pedido_detalle_id", as: "pedido_detalle" });
OrderItem.hasMany(SupplyOrderItem, { foreignKey: "pedido_detalle_id", as: "insumos_usados" });

SupplyOrderItem.belongsTo(Supply, { foreignKey: "insumo_id", as: "insumo" });
Supply.hasMany(SupplyOrderItem, { foreignKey: "insumo_id", as: "consumos" });
