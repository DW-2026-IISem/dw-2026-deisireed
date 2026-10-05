/**
 * Documentación OpenAPI del feature Client.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: todos los endpoints son **SIN AUTH** (la Fase I no implementa autenticación).
 */

/** Parámetro de ruta `:id`, común a las operaciones por id. */
const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "id numérico (> 0). Si no lo es, la API responde 400.",
  schema: { type: "integer", minimum: 1 },
};

const invalidId = { description: "id inválido (debe ser un entero positivo)" };
const notFound = { description: "No encontrado" };
const duplicated = { description: "Ya existe un cliente con ese numero_documento" };

export const clientsSwagger = {
  tags: [
    {
      name: "Clientes",
      description: "CRUD de clientes — **SIN AUTH**",
    },
  ],
  paths: {
    "/api/clientes": {
      get: {
        tags: ["Clientes"],
        summary: "Listar clientes activos",
        description: "SIN AUTH — retorna clientes con is_active=true",
        responses: {
          "200": {
            description: "Lista de clientes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clients: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Client" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Clientes"],
        summary: "Crear cliente",
        description: "SIN AUTH — numero_documento debe ser único",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cliente creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    client: { $ref: "#/components/schemas/Client" },
                  },
                },
              },
            },
          },
          "400": { description: "Datos inválidos (campos obligatorios o email)" },
          "409": duplicated,
        },
      },
    },
    "/api/clientes/{id}": {
      get: {
        tags: ["Clientes"],
        summary: "Obtener cliente por id",
        description: "SIN AUTH — 404 si no existe o tiene borrado lógico",
        parameters: [idParam],
        responses: {
          "200": {
            description: "Cliente encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    client: { $ref: "#/components/schemas/Client" },
                  },
                },
              },
            },
          },
          "400": invalidId,
          "404": notFound,
        },
      },
      put: {
        tags: ["Clientes"],
        summary: "Actualizar cliente (PUT — reemplazo)",
        description: "SIN AUTH — is_active no se envía; solo cambia con /deactivate",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": invalidId,
          "404": notFound,
          "409": duplicated,
        },
      },
      patch: {
        tags: ["Clientes"],
        summary: "Actualizar cliente (PATCH — parcial)",
        description: "SIN AUTH — solo cambia los campos enviados",
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": invalidId,
          "404": notFound,
          "409": duplicated,
        },
      },
      delete: {
        tags: ["Clientes"],
        summary: "Eliminar cliente (físico)",
        description: "SIN AUTH — borra la fila (también si tiene borrado lógico)",
        parameters: [idParam],
        responses: {
          "200": { description: "Eliminado" },
          "400": invalidId,
          "404": notFound,
        },
      },
    },
    "/api/clientes/{id}/deactivate": {
      patch: {
        tags: ["Clientes"],
        summary: "Eliminar cliente (lógico)",
        description: "SIN AUTH — is_active = false",
        parameters: [idParam],
        responses: {
          "200": { description: "Desactivado" },
          "400": invalidId,
          "404": notFound,
        },
      },
    },
  },
  components: {
    schemas: {
      Client: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          tipo_documento: { type: "string", example: "CC" },
          numero_documento: { type: "string", example: "1234567890" },
          nombre: { type: "string", example: "Ana Pérez" },
          telefono: { type: "string", nullable: true, example: "3001234567" },
          email: { type: "string", format: "email", nullable: true, example: "ana@example.com" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ClientCreate: {
        type: "object",
        required: ["tipo_documento", "numero_documento", "nombre"],
        properties: {
          tipo_documento: { type: "string", example: "CC" },
          numero_documento: { type: "string", example: "1234567890" },
          nombre: { type: "string", example: "Ana Pérez" },
          telefono: { type: "string", nullable: true },
          email: { type: "string", format: "email", nullable: true },
          is_active: { type: "boolean", default: true },
        },
      },
      ClientUpdate: {
        type: "object",
        required: ["tipo_documento", "numero_documento", "nombre"],
        properties: {
          tipo_documento: { type: "string" },
          numero_documento: { type: "string" },
          nombre: { type: "string" },
          telefono: { type: "string", nullable: true },
          email: { type: "string", format: "email", nullable: true },
        },
      },
      ClientPatch: {
        type: "object",
        properties: {
          tipo_documento: { type: "string" },
          numero_documento: { type: "string" },
          nombre: { type: "string" },
          telefono: { type: "string", nullable: true },
          email: { type: "string", format: "email", nullable: true },
        },
      },
    },
  },
};
