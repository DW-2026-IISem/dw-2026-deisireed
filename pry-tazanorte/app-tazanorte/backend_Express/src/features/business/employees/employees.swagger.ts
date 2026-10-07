import { crudPaths } from "../../../shared/http/swagger-crud";

/**
 * Documentación OpenAPI del feature Employee.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 * Leyenda: todos los endpoints son **SIN AUTH** (la Fase I no implementa autenticación).
 */
export const employeesSwagger = {
  tags: [{ name: "Empleados", description: "CRUD de empleados — **SIN AUTH**" }],
  paths: crudPaths({
    basePath: "/api/empleados",
    tag: "Empleados",
    listKey: "employees",
    itemKey: "employee",
    schema: "Employee",
  }),
  components: {
    schemas: {
      Employee: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Laura Gómez" },
          descripcion: { type: "string", nullable: true, example: "Barista turno mañana" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      EmployeeCreate: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          is_active: { type: "boolean", default: true },
        },
      },
      EmployeeUpdate: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
        },
      },
      EmployeePatch: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
        },
      },
    },
  },
};
