
/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos (ISS-12)
 *
 * components:
 *   schemas:
 *     Pago:
 *       type: object
 *       required:
 *         - referencia_tipo
 *         - referencia_id
 *         - metodo
 *         - monto
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         referencia_tipo:
 *           type: string
 *           example: PEDIDO
 *         referencia_id:
 *           type: integer
 *           example: 1
 *         metodo:
 *           type: string
 *           example: EFECTIVO
 *         monto:
 *           type: number
 *           minimum: 0.01
 *           example: 53500
 *         fecha:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           example: COMPLETADO
 *
 *     ActualizarPago:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         referencia_tipo:
 *           type: string
 *           example: PEDIDO
 *         referencia_id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         metodo:
 *           type: string
 *           example: EFECTIVO
 *         monto:
 *           type: number
 *           exclusiveMinimum: 0
 *           example: 53500
 *         fecha:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           example: COMPLETADO
 *
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Crear un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 *
 * /api/pagos/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: Identificador del pago
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     summary: Obtener pago por ID
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Pago encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar pago por ID
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarPago'
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Pago actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pago no encontrado
 *   patch:
 *     summary: Actualizar parcialmente un pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarPago'
 *     responses:
 *       200:
 *         description: Pago actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pago no encontrado
 *   delete:
 *     summary: Eliminar pago por ID
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Pago eliminado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pago no encontrado
 */

