import { Router } from 'express';
import { ResourceController } from './controllers/resource.controller';

const router = Router();
const c = new ResourceController();

router.post('/', (q, r) => c.create(q, r));
router.get('/', (q, r) => c.findAll(q, r));
router.get('/:id', (q, r) => c.findById(q, r));

export default router;
