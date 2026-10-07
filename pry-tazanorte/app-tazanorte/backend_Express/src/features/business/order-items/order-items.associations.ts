import { OrderItem } from "./order-item.model";
import { Order } from "../orders/order.model";
import { Product } from "../products/product.model";

OrderItem.belongsTo(Order, { foreignKey: "pedido_id", as: "pedido" });
OrderItem.belongsTo(Product, { foreignKey: "producto_id", as: "producto" });
Order.hasMany(OrderItem, { foreignKey: "pedido_id", as: "items" });
Product.hasMany(OrderItem, { foreignKey: "producto_id", as: "order_items" });
