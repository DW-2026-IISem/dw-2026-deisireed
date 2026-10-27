import { RESOURCE_CATALOG } from "../resources/resource-catalog";

/**
 * **Matriz de permisos de TazaNorte** (rol -> operaciones `"METHOD /ruta"`).
 *
 * Es la decisión de negocio que pide el anexo (sección 5): qué puede hacer cada
 * rol. El seeder de `resource_roles` la traduce a concesiones; después se
 * administra en caliente con `/api/concesiones-rol`.
 *
 * | Rol        | Qué hace                                                             |
 * |------------|----------------------------------------------------------------------|
 * | ADMIN      | Todo (los 105 recursos), incluida la administración de seguridad     |
 * | CAJA       | Clientes, pedidos y sus líneas, pagos y puntos; consulta catálogo    |
 * | BARISTA    | Consulta y avanza pedidos; registra el consumo de insumos            |
 * | BODEGA     | Gestiona insumos; consulta y anula consumos; consulta productos      |
 * | SUPERVISOR | Consulta toda la operación; gestiona empleados y turnos de caja;     |
 * |            | confirma/anula pagos y puntos; consulta usuarios y sus permisos      |
 *
 * Lo que no está en la lista de un rol está **denegado** (deny by default).
 */

const read = (base: string) => [`GET ${base}`, `GET ${base}/:id`];
const write = (base: string) => [`POST ${base}`, `PUT ${base}/:id`, `PATCH ${base}/:id`];
const remove = (base: string) => [`DELETE ${base}/:id`, `PATCH ${base}/:id/deactivate`];

/** Lecturas de las 10 features de negocio + el saldo de puntos. */
const ALL_BUSINESS_READS = [
  ...read("/api/clientes"),
  ...read("/api/productos"),
  ...read("/api/empleados"),
  ...read("/api/insumos"),
  ...read("/api/turnos-caja"),
  ...read("/api/pedidos"),
  ...read("/api/detalle-pedidos"),
  ...read("/api/insumo-pedido-detalles"),
  ...read("/api/pagos"),
  ...read("/api/puntos-fidelizacion"),
  "GET /api/puntos-fidelizacion/cliente/:id/saldo",
];

export const ROLE_MATRIX: Record<string, readonly string[]> = {
  ADMIN: RESOURCE_CATALOG.map((r) => `${r.method} ${r.path}`),

  CAJA: [
    ...read("/api/clientes"), ...write("/api/clientes"),
    ...read("/api/productos"),
    ...read("/api/turnos-caja"),
    ...read("/api/pedidos"), ...write("/api/pedidos"),
    "PATCH /api/pedidos/:id/estado", "PATCH /api/pedidos/:id/deactivate",
    ...read("/api/detalle-pedidos"), ...write("/api/detalle-pedidos"),
    "PATCH /api/detalle-pedidos/:id/deactivate",
    ...read("/api/pagos"), "POST /api/pagos", "PATCH /api/pagos/:id",
    ...read("/api/puntos-fidelizacion"), "POST /api/puntos-fidelizacion",
    "GET /api/puntos-fidelizacion/cliente/:id/saldo",
  ],

  BARISTA: [
    ...read("/api/productos"),
    ...read("/api/pedidos"), "PATCH /api/pedidos/:id/estado",
    ...read("/api/detalle-pedidos"),
    ...read("/api/insumos"),
    ...read("/api/insumo-pedido-detalles"), ...write("/api/insumo-pedido-detalles"),
  ],

  BODEGA: [
    ...read("/api/insumos"), ...write("/api/insumos"), ...remove("/api/insumos"),
    ...read("/api/insumo-pedido-detalles"), "PATCH /api/insumo-pedido-detalles/:id/deactivate",
    ...read("/api/productos"),
  ],

  SUPERVISOR: [
    ...ALL_BUSINESS_READS,
    ...write("/api/empleados"), "PATCH /api/empleados/:id/deactivate",
    ...write("/api/turnos-caja"), "PATCH /api/turnos-caja/:id/deactivate",
    "PATCH /api/pedidos/:id/estado",
    "PATCH /api/pagos/:id", "PATCH /api/pagos/:id/deactivate",
    "PATCH /api/puntos-fidelizacion/:id/deactivate",
    "GET /api/usuarios", "GET /api/usuarios/:id", "GET /api/usuarios/:id/permisos",
  ],
};
