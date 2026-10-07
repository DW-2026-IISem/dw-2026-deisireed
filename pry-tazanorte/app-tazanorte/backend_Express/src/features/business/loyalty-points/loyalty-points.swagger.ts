/**
 * @swagger
 * components:
 *   schemas:
 *     PuntosFidelizacion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         clientId:
 *           type: integer
 *           example: 5
 *         points:
 *           type: integer
 *           example: 120
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: PuntosFidelizacion
 *   description: Gestión de Puntos de Fidelización (ISS-13)
 */

/**
 * @swagger
 * /api/puntos-fidelizacion:
 *   get:
 *     summary: Obtener todos los registros de puntos de fidelización
 *     tags: [PuntosFidelizacion]
 *     responses:
 *       200:
 *         description: Lista de puntos
 *   post:
 *     summary: Asignar o registrar puntos a un cliente
 *     tags: [PuntosFidelizacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - points
 *             properties:
 *               clientId:
 *                 type: integer
 *               points:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Registro de puntos creado correctamente
 */

/**
 * @swagger
 * /api/puntos-fidelizacion/{id}:
 *   get:
 *     summary: Obtener registro de puntos por ID
 *     tags: [PuntosFidelizacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del registro de puntos
 *   put:
 *     summary: Actualizar cantidad de puntos por ID
 *     tags: [PuntosFidelizacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Puntos actualizados correctamente
 *   delete:
 *     summary: Eliminar registro de puntos
 *     tags: [PuntosFidelizacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 */
