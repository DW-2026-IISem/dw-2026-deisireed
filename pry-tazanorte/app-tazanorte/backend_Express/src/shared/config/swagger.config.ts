import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API TazaNorte - Cafetería y Fidelización',
      version: '1.0.0',
      description: 'Documentación Oficial Completa - Módulos de Negocio y Seguridad RBAC (ISS-01 a ISS-20)',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor Local',
      },
    ],
    tags: [
      { name: 'Clientes', description: 'Gestión de clientes (ISS-01/02)' },
      { name: 'Productos', description: 'Gestión de productos y categorías (ISS-03/04)' },
      { name: 'Empleados', description: 'Gestión de empleados y roles (ISS-05/06)' },
      { name: 'Insumos', description: 'Gestión de insumos e inventario (ISS-07)' },
      { name: 'Cajas', description: 'Gestión de cajas registradoras (ISS-08)' },
      { name: 'Pedidos', description: 'Gestión de pedidos (ISS-09)' },
      { name: 'DetallesPedido', description: 'Detalles de ítems por pedido (ISS-10)' },
      { name: 'SuministroPedidoArticulos', description: 'Insumos consumidos por pedido (ISS-11)' },
      { name: 'Pagos', description: 'Gestión de pagos (ISS-12)' },
      { name: 'PuntosFidelizacion', description: 'Puntos de fidelización (ISS-13)' },
      { name: 'Autenticación', description: 'Gestión de sesiones, Tokens JWT y Refresh Tokens (ISS-14 a ISS-16)' },
      { name: 'Usuarios', description: 'Administración de usuarios del sistema (ISS-17)' },
      { name: 'Roles', description: 'Gestión de roles de usuario (ISS-18)' },
      { name: 'Recursos', description: 'Gestión de recursos y endpoints del sistema (ISS-19)' },
      { name: 'Asignaciones usuario-rol', description: 'Asignar / retirar / reactivar el rol de un usuario' },
      { name: 'Concesiones rol-recurso', description: 'Conceder / retirar / reactivar recursos a un rol (ISS-20)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // Clientes (ISS-01/02)
      '/api/v1/clientes': {
        get: { tags: ['Clientes'], summary: 'Listar clientes', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Clientes'], summary: 'Crear cliente', responses: { 201: { description: 'Creado' } } },
      },
      '/api/v1/clientes/{id}': {
        get: { tags: ['Clientes'], summary: 'Obtener cliente por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Clientes'], summary: 'Actualizar cliente', responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Clientes'], summary: 'Eliminar cliente', responses: { 200: { description: 'OK' } } },
      },

      // Productos (ISS-03/04)
      '/api/v1/productos': {
        get: { tags: ['Productos'], summary: 'Listar productos', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Productos'], summary: 'Crear producto', responses: { 201: { description: 'Creado' } } },
      },
      '/api/v1/productos/{id}': {
        get: { tags: ['Productos'], summary: 'Obtener producto por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Productos'], summary: 'Actualizar producto', responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Productos'], summary: 'Eliminar producto', responses: { 200: { description: 'OK' } } },
      },

      // Empleados (ISS-05/06)
      '/api/v1/empleados': {
        get: { tags: ['Empleados'], summary: 'Listar empleados', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Empleados'], summary: 'Crear empleado', responses: { 201: { description: 'Creado' } } },
      },
      '/api/v1/empleados/{id}': {
        get: { tags: ['Empleados'], summary: 'Obtener empleado por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Empleados'], summary: 'Actualizar empleado', responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Empleados'], summary: 'Eliminar empleado', responses: { 200: { description: 'OK' } } },
      },

      // Insumos (ISS-07)
      '/api/v1/insumos': {
        get: { tags: ['Insumos'], summary: 'Listar insumos', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Insumos'], summary: 'Crear insumo', responses: { 201: { description: 'Creado' } } },
      },
      '/api/v1/insumos/{id}': {
        get: { tags: ['Insumos'], summary: 'Obtener insumo por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Insumos'], summary: 'Actualizar insumo', responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Insumos'], summary: 'Eliminar insumo', responses: { 200: { description: 'OK' } } },
      },

      // Cajas (ISS-08)
      '/api/v1/cajas': {
        get: { tags: ['Cajas'], summary: 'Listar cajas', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Cajas'], summary: 'Crear caja', responses: { 201: { description: 'Creado' } } },
      },
      '/api/v1/cajas/{id}': {
        get: { tags: ['Cajas'], summary: 'Obtener caja por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Cajas'], summary: 'Actualizar caja', responses: { 200: { description: 'OK' } } },
        delete: { tags: ['Cajas'], summary: 'Eliminar caja', responses: { 200: { description: 'OK' } } },
      },

      // Pedidos (ISS-09)
      '/api/v1/pedidos': {
        get: { tags: ['Pedidos'], summary: 'Listar pedidos', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Pedidos'], summary: 'Crear pedido', responses: { 201: { description: 'Creado' } } },
      },
      '/api/v1/pedidos/{id}': {
        get: { tags: ['Pedidos'], summary: 'Obtener pedido por ID', responses: { 200: { description: 'OK' } } },
        put: { tags: ['Pedidos'], summary: 'Actualizar pedido', responses: { 200: { description: 'OK' } } },
      },

      // DetallesPedido (ISS-10)
      '/api/v1/detalles-pedido': {
        get: { tags: ['DetallesPedido'], summary: 'Listar detalles de pedido', responses: { 200: { description: 'OK' } } },
      },

      // SuministroPedidoArticulos (ISS-11)
      '/api/v1/suministros-pedido': {
        get: { tags: ['SuministroPedidoArticulos'], summary: 'Listar suministros de pedido', responses: { 200: { description: 'OK' } } },
      },

      
      // Pagos (ISS-12)
      '/api/v1/pagos': {
        get: {
          tags: ['Pagos'],
          summary: 'Listar pagos',
          responses: {
            200: { description: 'Lista de pagos obtenida correctamente' },
            500: { description: 'Error interno del servidor' },
          },
        },
        post: {
          tags: ['Pagos'],
          summary: 'Registrar pago',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: [
                    'referencia_tipo',
                    'referencia_id',
                    'metodo',
                    'monto',
                  ],
                  properties: {
                    referencia_tipo: { type: 'string', example: 'PEDIDO' },
                    referencia_id: { type: 'integer', example: 1, minimum: 1 },
                    metodo: { type: 'string', example: 'EFECTIVO' },
                    monto: { type: 'number', example: 53500, exclusiveMinimum: 0 },
                    fecha: { type: 'string', format: 'date-time' },
                    estado: { type: 'string', example: 'COMPLETADO' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Pago creado correctamente' },
            400: { description: 'Datos inválidos' },
          },
        },
      },
      '/api/v1/pagos/{id}': {
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'Identificador del pago',
            schema: { type: 'integer', minimum: 1 },
          },
        ],
        get: {
          tags: ['Pagos'],
          summary: 'Consultar pago por ID',
          responses: {
            200: { description: 'Pago encontrado' },
            400: { description: 'ID inválido' },
            404: { description: 'Pago no encontrado' },
          },
        },
        put: {
          tags: ['Pagos'],
          summary: 'Actualizar pago por ID',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  minProperties: 1,
                  properties: {
                    referencia_tipo: { type: 'string', example: 'PEDIDO' },
                    referencia_id: { type: 'integer', minimum: 1, example: 1 },
                    metodo: { type: 'string', example: 'EFECTIVO' },
                    monto: { type: 'number', exclusiveMinimum: 0, example: 53500 },
                    fecha: { type: 'string', format: 'date-time' },
                    estado: { type: 'string', example: 'PENDIENTE' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Pago actualizado correctamente' },
            400: { description: 'Datos inválidos' },
            404: { description: 'Pago no encontrado' },
          },
        },
        patch: {
          tags: ['Pagos'],
          summary: 'Actualizar parcialmente un pago',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  minProperties: 1,
                  properties: {
                    referencia_tipo: { type: 'string', example: 'PEDIDO' },
                    referencia_id: { type: 'integer', minimum: 1, example: 1 },
                    metodo: { type: 'string', example: 'EFECTIVO' },
                    monto: { type: 'number', exclusiveMinimum: 0, example: 53500 },
                    fecha: { type: 'string', format: 'date-time' },
                    estado: { type: 'string', example: 'PENDIENTE' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Pago actualizado correctamente' },
            400: { description: 'Datos inválidos' },
            404: { description: 'Pago no encontrado' },
          },
        },
        delete: {
          tags: ['Pagos'],
          summary: 'Eliminar pago por ID',
          responses: {
            200: { description: 'Pago eliminado correctamente' },
            400: { description: 'ID inválido' },
            404: { description: 'Pago no encontrado' },
          },
        },
      },


      // PuntosFidelizacion (ISS-13)
      '/api/v1/puntos-fidelizacion': {
        get: { tags: ['PuntosFidelizacion'], summary: 'Consultar puntos de fidelización', responses: { 200: { description: 'OK' } } },
      },

      // Autenticación & RBAC (ISS-14 a ISS-20)
      '/api/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión y obtener JWT Access Token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Login exitoso' } },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Autenticación'],
          summary: 'Refrescar token de acceso',
          responses: { 200: { description: 'Token renovado' } },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Autenticación'],
          summary: 'Cerrar sesión',
          responses: { 200: { description: 'Sesión cerrada' } },
        },
      },
      '/api/users': {
        get: { tags: ['Usuarios'], summary: 'Obtener lista de usuarios registrados', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Usuarios'], summary: 'Crear nuevo usuario', responses: { 201: { description: 'Creado' } } },
      },
      '/api/users/{id}': {
        get: { tags: ['Usuarios'], summary: 'Obtener usuario por ID', responses: { 200: { description: 'OK' } } },
      },
      '/api/roles': {
        get: { tags: ['Roles'], summary: 'Listar todos los roles', responses: { 200: { description: 'OK' } } },
      },
      '/api/recursos': {
        get: { tags: ['Recursos'], summary: 'Listar todos los recursos protegidos del sistema', responses: { 200: { description: 'OK' } } },
      },
      '/api/asignaciones-rol': {
        get: { tags: ['Asignaciones usuario-rol'], summary: 'Listar asignaciones activas', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Asignaciones usuario-rol'], summary: 'Asignar rol a usuario', responses: { 201: { description: 'Creado' } } },
      },
      '/api/concesiones-rol': {
        get: { tags: ['Concesiones rol-recurso'], summary: 'Listar concesiones activas', responses: { 200: { description: 'OK' } } },
        post: { tags: ['Concesiones rol-recurso'], summary: 'Conceder recurso a rol', responses: { 201: { description: 'Creado' } } },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
