import swaggerUi from "swagger-ui-express";
import { Application, Request, Response } from "express";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API TazaNorte - Cafetería y Fidelización",
    version: "1.0.0",
    description: "Documentación oficial completa - 10 Módulos Integrados",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Servidor Local",
    },
  ],
  tags: [
    { name: "Clientes", description: "Gestión de clientes (ISS-01/02)" },
    { name: "Productos", description: "Gestión de productos y categorías (ISS-03/04)" },
    { name: "Empleados", description: "Gestión de empleados y roles (ISS-05/06)" },
    { name: "Insumos", description: "Gestión de insumos e inventario (ISS-07)" },
    { name: "Cajas", description: "Gestión de cajas registradoras (ISS-08)" },
    { name: "Pedidos", description: "Gestión de pedidos (ISS-09)" },
    { name: "DetallesPedido", description: "Detalles de ítems por pedido (ISS-10)" },
    { name: "SupplyOrderItems", description: "Insumos consumidos por pedido (ISS-11)" },
    { name: "Pagos", description: "Gestión de pagos (ISS-12)" },
    { name: "PuntosFidelizacion", description: "Puntos de fidelización (ISS-13)" },
  ],
  components: {
    schemas: {
      Cliente: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, email: { type: "string" } } },
      Producto: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, precio: { type: "number" } } },
      Empleado: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, rol: { type: "string" } } },
      Insumo: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, stock: { type: "number" } } },
      Caja: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" }, estado: { type: "string" } } },
      Pedido: { type: "object", properties: { id: { type: "integer" }, total: { type: "number" }, estado: { type: "string" } } },
      DetallePedido: { type: "object", properties: { id: { type: "integer" }, cantidad: { type: "integer" }, subtotal: { type: "number" } } },
      SupplyOrderItem: { type: "object", properties: { id: { type: "integer" }, cantidadUsada: { type: "number" } } },
      Pago: { type: "object", properties: { id: { type: "integer" }, monto: { type: "number" }, metodoPago: { type: "string" } } },
      PuntosFidelizacion: { type: "object", properties: { id: { type: "integer" }, clientId: { type: "integer" }, points: { type: "integer" } } },
    },
  },
  paths: {
    "/api/clientes": { get: { tags: ["Clientes"], summary: "Listar clientes", responses: { 200: { description: "OK" } } }, post: { tags: ["Clientes"], summary: "Crear cliente", responses: { 201: { description: "Creado" } } } },
    "/api/clientes/{id}": { get: { tags: ["Clientes"], summary: "Obtener cliente por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Clientes"], summary: "Actualizar cliente", responses: { 200: { description: "OK" } } }, delete: { tags: ["Clientes"], summary: "Eliminar cliente", responses: { 200: { description: "OK" } } } },
    "/api/productos": { get: { tags: ["Productos"], summary: "Listar productos", responses: { 200: { description: "OK" } } }, post: { tags: ["Productos"], summary: "Crear producto", responses: { 201: { description: "Creado" } } } },
    "/api/productos/{id}": { get: { tags: ["Productos"], summary: "Obtener producto por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Productos"], summary: "Actualizar producto", responses: { 200: { description: "OK" } } }, delete: { tags: ["Productos"], summary: "Eliminar producto", responses: { 200: { description: "OK" } } } },
    "/api/empleados": { get: { tags: ["Empleados"], summary: "Listar empleados", responses: { 200: { description: "OK" } } }, post: { tags: ["Empleados"], summary: "Crear empleado", responses: { 201: { description: "Creado" } } } },
    "/api/empleados/{id}": { get: { tags: ["Empleados"], summary: "Obtener empleado por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Empleados"], summary: "Actualizar empleado", responses: { 200: { description: "OK" } } }, delete: { tags: ["Empleados"], summary: "Eliminar empleado", responses: { 200: { description: "OK" } } } },
    "/api/insumos": { get: { tags: ["Insumos"], summary: "Listar insumos", responses: { 200: { description: "OK" } } }, post: { tags: ["Insumos"], summary: "Crear insumo", responses: { 201: { description: "Creado" } } } },
    "/api/insumos/{id}": { get: { tags: ["Insumos"], summary: "Obtener insumo por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Insumos"], summary: "Actualizar insumo", responses: { 200: { description: "OK" } } }, delete: { tags: ["Insumos"], summary: "Eliminar insumo", responses: { 200: { description: "OK" } } } },
    "/api/cajas": { get: { tags: ["Cajas"], summary: "Listar cajas", responses: { 200: { description: "OK" } } }, post: { tags: ["Cajas"], summary: "Crear caja", responses: { 201: { description: "Creado" } } } },
    "/api/cajas/{id}": { get: { tags: ["Cajas"], summary: "Obtener caja por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Cajas"], summary: "Actualizar caja", responses: { 200: { description: "OK" } } }, delete: { tags: ["Cajas"], summary: "Eliminar caja", responses: { 200: { description: "OK" } } } },
    "/api/pedidos": { get: { tags: ["Pedidos"], summary: "Listar pedidos", responses: { 200: { description: "OK" } } }, post: { tags: ["Pedidos"], summary: "Crear pedido", responses: { 201: { description: "Creado" } } } },
    "/api/pedidos/{id}": { get: { tags: ["Pedidos"], summary: "Obtener pedido por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Pedidos"], summary: "Actualizar pedido", responses: { 200: { description: "OK" } } }, delete: { tags: ["Pedidos"], summary: "Eliminar pedido", responses: { 200: { description: "OK" } } } },
    "/api/detalles-pedido": { get: { tags: ["DetallesPedido"], summary: "Listar detalles de pedidos", responses: { 200: { description: "OK" } } }, post: { tags: ["DetallesPedido"], summary: "Crear detalle de pedido", responses: { 201: { description: "Creado" } } } },
    "/api/detalles-pedido/{id}": { get: { tags: ["DetallesPedido"], summary: "Obtener detalle por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["DetallesPedido"], summary: "Actualizar detalle", responses: { 200: { description: "OK" } } }, delete: { tags: ["DetallesPedido"], summary: "Eliminar detalle", responses: { 200: { description: "OK" } } } },
    "/api/insumo-pedido-detalles": { get: { tags: ["SupplyOrderItems"], summary: "Listar insumos por pedido", responses: { 200: { description: "OK" } } }, post: { tags: ["SupplyOrderItems"], summary: "Registrar consumo de insumo", responses: { 201: { description: "Creado" } } } },
    "/api/insumo-pedido-detalles/{id}": { get: { tags: ["SupplyOrderItems"], summary: "Obtener registro por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["SupplyOrderItems"], summary: "Actualizar registro", responses: { 200: { description: "OK" } } }, delete: { tags: ["SupplyOrderItems"], summary: "Eliminar registro", responses: { 200: { description: "OK" } } } },
    "/api/pagos": { get: { tags: ["Pagos"], summary: "Listar pagos", responses: { 200: { description: "OK" } } }, post: { tags: ["Pagos"], summary: "Crear nuevo pago", responses: { 201: { description: "Creado" } } } },
    "/api/pagos/{id}": { get: { tags: ["Pagos"], summary: "Obtener pago por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["Pagos"], summary: "Actualizar pago por ID", responses: { 200: { description: "OK" } } }, delete: { tags: ["Pagos"], summary: "Eliminar pago por ID", responses: { 200: { description: "OK" } } } },
    "/api/puntos-fidelizacion": { get: { tags: ["PuntosFidelizacion"], summary: "Listar puntos de fidelización", responses: { 200: { description: "OK" } } }, post: { tags: ["PuntosFidelizacion"], summary: "Asignar puntos a cliente", responses: { 201: { description: "Creado" } } } },
    "/api/puntos-fidelizacion/{id}": { get: { tags: ["PuntosFidelizacion"], summary: "Obtener puntos por ID", responses: { 200: { description: "OK" } } }, put: { tags: ["PuntosFidelizacion"], summary: "Actualizar puntos por ID", responses: { 200: { description: "OK" } } }, delete: { tags: ["PuntosFidelizacion"], summary: "Eliminar registro de puntos", responses: { 200: { description: "OK" } } } },
  },
};

export const setupSwagger = (app: Application): void => {
  app.get("/api/docs-json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.json(swaggerSpec);
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
