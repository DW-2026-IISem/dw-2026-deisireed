import { crudPaths } from "../../../shared/http/swagger-crud";

/**
 * Documentación OpenAPI del feature CashRegister (TurnoCaja).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 * Leyenda: todos los endpoints son **SIN AUTH** (la Fase I no implementa autenticación).
 *
 * Reglas extra: `empleado_id` debe existir (404) y estar activo (400) al crear o
 * actualizar. Borrar físicamente un empleado con turnos responde 409.
 */
export const cashRegistersSwagger = {
  tags: [
    {
      name: "TurnosCaja",
      description: "CRUD de turnos de caja — **SIN AUTH** (empleado_id debe ser un empleado activo)",
    },
  ],
  paths: crudPaths({
    basePath: "/api/turnos-caja",
    tag: "TurnosCaja",
    listKey: "cash_registers",
    itemKey: "cash_register",
    schema: "CashRegister",
  }),
  components: {
    schemas: {
      CashRegister: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Turno mañana" },
          descripcion: { type: "string", nullable: true, example: "6:00 a 14:00" },
          empleado_id: { type: "integer", example: 1 },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CashRegisterCreate: {
        type: "object",
        required: ["nombre", "empleado_id"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          empleado_id: { type: "integer", minimum: 1 },
          is_active: { type: "boolean", default: true },
        },
      },
      CashRegisterUpdate: {
        type: "object",
        required: ["nombre", "empleado_id"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          empleado_id: { type: "integer", minimum: 1 },
        },
      },
      CashRegisterPatch: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          empleado_id: { type: "integer", minimum: 1 },
        },
      },
    },
  },
};
