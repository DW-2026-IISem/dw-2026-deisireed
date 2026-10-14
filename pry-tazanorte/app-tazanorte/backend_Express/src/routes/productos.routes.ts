import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /api/v1/productos:
 *   get:
 *     summary: Obtener lista de productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *   post:
 *     summary: Crear producto
 *     tags:
 *       - Productos
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.get('/', (req, res) => { res.json({ message: 'Lista de productos' }); });
router.post('/', (req, res) => { res.json({ message: 'Producto creado' }); });

export default router;
