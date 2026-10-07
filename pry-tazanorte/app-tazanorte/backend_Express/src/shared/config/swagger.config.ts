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
      // Módulos Parte 1
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
      
      // Módulos Parte 2 (ISS-14 a ISS-20)
      { name: 'Autenticación', description: 'Gestión de sesiones, Tokens JWT y Refresh Tokens (ISS-14 a ISS-16)' },
      { name: 'Usuarios', description: 'Administración de usuarios del sistema (ISS-17)' },
      { name: 'Roles', description: 'Gestión de roles de usuario (ISS-18)' },
      { name: 'Recursos', description: 'Gestión de recursos y endpoints del sistema (ISS-19)' },
      { name: 'Asignaciones usuario-rol', description: 'Asignar / retirar / reactivar el rol de un usuario — JWT + RBAC' },
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
      schemas: {
        // Esquemas Parte 1
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
        
        // Esquemas Parte 2
        Usuario: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, email: { type: 'string' }, is_active: { type: 'boolean' } } },
        Rol: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, description: { type: 'string' } } },
        Recurso: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, path: { type: 'string' }, method: { type: 'string' }, module: { type: 'string' } } },
        RolUsuario: { type: 'object', properties: { user_id: { type: 'string' }, role_id: { type: 'string' } } },
        RecursoRol: { type: 'object', properties: { resource_id: { type: 'string' }, role_id: { type: 'string' } } },
        RefreshToken: { type: 'object', properties: { id: { type: 'string' }, user_id: { type: 'string' }, token: { type: 'string' }, is_revoked: { type: 'boolean' } } },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión y obtener JWT Access Token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', example: 'admin@tazanorte.com' }, password: { type: 'string', example: 'Admin123456!' } } } } },
          },
          responses: { 200: { description: 'Login exitoso' } },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Autenticación'],
          summary: 'Refrescar token de acceso',
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
        post: { tags: ['Concesiones rol-recurso'], summary: 'Conceder recurso a rol (crear permiso)', responses: { 201: { description: 'Creado' } } },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
