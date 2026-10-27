/**
 * Catálogo de los **recursos** de TazaNorte (fuente única).
 *
 * Un recurso es un par `(method, path)` con la ruta en patrón; un permiso es la
 * concesión de un recurso a un rol (ISS-19). Este archivo puebla la tabla
 * `resources` y de él se deriva la matriz de permisos por rol.
 *
 * | Grupo                                        | Recursos |
 * |----------------------------------------------|---------:|
 * | 10 features de negocio × 7 (CRUD estándar)   | 70 |
 * | Pedidos: cambio de estado                    | 1 |
 * | Puntos: saldo del cliente                    | 1 |
 * | Usuarios (CRUD + contraseña + permisos)      | 9 |
 * | Roles                                        | 7 |
 * | Recursos                                     | 7 |
 * | Asignaciones usuario-rol                     | 5 |
 * | Concesiones rol-recurso                      | 5 |
 * | **Total**                                    | **105** |
 *
 * Las operaciones de sesión (`/api/sesion/*`, `/api/sesiones/*`) **no** son
 * recursos RBAC: son las modalidades OPEN y JWT (no dependen de la matriz).
 */
export interface CatalogResource {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
}

/** Las 7 operaciones estándar de un feature: getAll, getOne, create, PUT, PATCH, delete físico y lógico. */
function crud(basePath: string, singular: string, plural: string): CatalogResource[] {
  return [
    { method: "GET", path: basePath, description: `Listar ${plural}` },
    { method: "GET", path: `${basePath}/:id`, description: `Consultar ${singular}` },
    { method: "POST", path: basePath, description: `Crear ${singular}` },
    { method: "PUT", path: `${basePath}/:id`, description: `Reemplazar ${singular}` },
    { method: "PATCH", path: `${basePath}/:id`, description: `Modificar ${singular}` },
    { method: "DELETE", path: `${basePath}/:id`, description: `Eliminar ${singular}` },
    { method: "PATCH", path: `${basePath}/:id/deactivate`, description: `Desactivar ${singular}` },
  ];
}

/** Asignaciones y concesiones: listar, consultar, crear, retirar y reactivar. */
function grants(basePath: string, singular: string, plural: string, verb: string): CatalogResource[] {
  return [
    { method: "GET", path: basePath, description: `Listar ${plural}` },
    { method: "GET", path: `${basePath}/:id`, description: `Consultar ${singular}` },
    { method: "POST", path: basePath, description: verb },
    { method: "PATCH", path: `${basePath}/:id/deactivate`, description: `Retirar ${singular}` },
    { method: "PATCH", path: `${basePath}/:id/reactivate`, description: `Reactivar ${singular}` },
  ];
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Negocio (72) ───────────────────────────────────────────────
  ...crud("/api/clientes", "cliente", "clientes"),
  ...crud("/api/productos", "producto", "productos"),
  ...crud("/api/empleados", "empleado", "empleados"),
  ...crud("/api/insumos", "insumo", "insumos"),
  ...crud("/api/turnos-caja", "turno de caja", "turnos de caja"),
  ...crud("/api/pedidos", "pedido", "pedidos"),
  { method: "PATCH", path: "/api/pedidos/:id/estado", description: "Cambiar estado de pedido" },
  ...crud("/api/detalle-pedidos", "detalle de pedido", "detalles de pedido"),
  ...crud("/api/insumo-pedido-detalles", "consumo de insumo", "consumos de insumo"),
  ...crud("/api/pagos", "pago", "pagos"),
  ...crud("/api/puntos-fidelizacion", "movimiento de puntos", "movimientos de puntos"),
  {
    method: "GET",
    path: "/api/puntos-fidelizacion/cliente/:id/saldo",
    description: "Consultar saldo de puntos de un cliente",
  },

  // ── Seguridad (33) ─────────────────────────────────────────────
  ...crud("/api/usuarios", "usuario", "usuarios"),
  { method: "PATCH", path: "/api/usuarios/:id/password", description: "Cambiar contraseña de usuario" },
  { method: "GET", path: "/api/usuarios/:id/permisos", description: "Consultar permisos efectivos del usuario" },
  ...crud("/api/roles", "rol", "roles"),
  ...crud("/api/recursos", "recurso", "recursos"),
  ...grants("/api/asignaciones-rol", "asignación usuario-rol", "asignaciones usuario-rol", "Asignar rol a usuario"),
  ...grants("/api/concesiones-rol", "concesión rol-recurso", "concesiones rol-recurso", "Conceder recurso a rol"),
];
