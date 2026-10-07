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
 *         referencia_tipo:
 *           type: string
 *           example: "PEDIDO"
 *         referencia_id:
 *           type: integer
 *           example: 1
 *         metodo:
 *           type: string
 *           example: "EFECTIVO"
 *         monto:
 *           type: number
 *           example: 15500.00
 *         fecha:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           example: "COMPLETADO"
 * 
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
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
 * 
 * /api/pagos/{id}:
 *   get:
 *     summary: Obtener pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago encontrado
 *   put:
 *     summary: Actualizar pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago actualizado
 *   delete:
 *     summary: Eliminar pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago eliminado
 */
