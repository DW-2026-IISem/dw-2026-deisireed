/**
 * @swagger
 * components:
 *   schemas:
 *     SupplyOrderItem:
 *       type: object
 *       required:
 *         - orderItemId
 *         - supplyId
 *         - quantityUsed
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generado del detalle de insumo
 *         orderItemId:
 *           type: integer
 *           description: ID del detalle de pedido
 *         supplyId:
 *           type: integer
 *           description: ID del insumo
 *         quantityUsed:
 *           type: number
 *           format: float
 *           description: Cantidad consumida del insumo
 *       example:
 *         id: 1
 *         orderItemId: 10
 *         supplyId: 5
 *         quantityUsed: 1.50
 *
 * tags:
 *   name: SupplyOrderItems
 *   description: Gestión de insumos por detalle de pedido (ISS-11)
 *
 * /api/insumo-pedido-detalles:
 *   get:
 *     summary: Obtener todos los insumos de detalles de pedido
 *     tags: [SupplyOrderItems]
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 *   post:
 *     summary: Registrar consumo de insumo en detalle de pedido
 *     tags: [SupplyOrderItems]
 *     responses:
 *       201:
 *         description: Creado correctamente
 */
