import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TazaNorte - Cafetería y Fidelización',
      version: '1.0.0',
      description: 'Documentación oficial completa - 10 Módulos de Negocio + Seguridad RBAC (ISS-01 a ISS-20)',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Esquemas Parte 1 (Negocio)
        Cliente: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
        Producto: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' }, precio: { type: 'number' } } },
        Empleado: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
        Insumo: { type: 'object', properties: { id: { type: 'string' }, nombre: { type: 'string' } } },
        Caja: { type: 'object', properties: { id: { type: 'string' }, estado: { type: 'string' } } },
        Pedido: { type: 'object', properties: { id: { type: 'string' }, total: { type: 'number' } } },
        DetallePedido: { type: 'object', properties: { id: { type: 'string' }, cantidad: { type: 'integer' } } },
        SuministroPedidoArticulo: { type: 'object', properties: { id: { type: 'string' } } },
        Pago: { type: 'object', properties: { id: { type: 'string' }, monto: { type: 'number' } } },
        PuntosFidelizacion: { type: 'object', properties: { id: { type: 'string' }, puntos: { type: 'integer' } } },
        
        // Esquemas Parte 2 (ISS-14 a ISS-20)
        Usuario: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, email: { type: 'string' }, is_active: { type: 'boolean' } } },
        Rol: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, description: { type: 'string' } } },
        Recurso: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, path: { type: 'string' }, method: { type: 'string' }, module: { type: 'string' } } },
        AsignacionUsuarioRol: { type: 'object', properties: { user_id: { type: 'string' }, role_id: { type: 'string' } } },
        ConcesionRolRecurso: { type: 'object', properties: { resource_id: { type: 'string' }, role_id: { type: 'string' } } },
        RefreshToken: { type: 'object', properties: { id: { type: 'string' }, user_id: { type: 'string' }, token: { type: 'string' }, is_revoked: { type: 'boolean' } } },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // Endpoints Autenticación (ISS-14 a ISS-16)
      '/api/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión y obtener tokens',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Login exitoso' }, 401: { description: 'Credenciales inválidas' } },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Autenticación'],
          summary: 'Refrescar Access Token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { refresh_token: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Token renovado' } },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Autenticación'],
          summary: 'Cerrar sesión',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { refresh_token: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Sesión revocada' } },
        },
      },

      // Endpoints Usuarios (ISS-17)
      '/api/usuarios': {
        get: { tags: ['Usuarios'], summary: 'Listar todos los usuarios — JWT + RBAC', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Usuarios'], summary: 'Crear nuevo usuario — JWT + RBAC', responses: { 201: { description: 'Creado' } } },
      },
      '/api/usuarios/{id}': {
        get: { tags: ['Usuarios'], summary: 'Obtener usuario por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Usuarios'], summary: 'Actualizar usuario', responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Usuarios'], summary: 'Eliminar usuario (borrado lógico)', responses: { 200: { description: 'OK' } } },
      },

      // Endpoints Roles (ISS-18)
      '/api/roles': {
        get: { tags: ['Roles'], summary: 'Listar roles — JWT + RBAC', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Roles'], summary: 'Crear rol — JWT + RBAC', responses: { 201: { description: 'Creado' } } },
      },

      // Endpoints Recursos (ISS-19)
      '/api/recursos': {
        get: { tags: ['Recursos'], summary: 'Listar recursos del sistema — JWT + RBAC', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Recursos'], summary: 'Crear recurso — JWT + RBAC', responses: { 201: { description: 'Creado' } } },
      },

      // Endpoints Asignaciones y Concesiones
      '/api/asignaciones-rol': {
        get: { tags: ['Asignaciones usuario-rol'], summary: 'Listar asignaciones activas — JWT + RBAC', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Asignaciones usuario-rol'], summary: 'Asignar rol a usuario', responses: { 201: { description: 'Creado' } } },
      },
      '/api/concesiones-rol': {
        get: { tags: ['Concesiones rol-recurso'], summary: 'Listar concesiones activas — JWT + RBAC', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Concesiones rol-recurso'], summary: 'Conceder recurso a rol (crear permiso)', responses: { 201: { description: 'Creado' } } },
      },
    },
  },
  apis: [
    './src/features/**/*.routes.ts',
    './src/features/**/*.controller.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
