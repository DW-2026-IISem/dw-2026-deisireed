import { Router } from 'express';
import { RoleController } from './controllers/role.controller';

const router = Router();
const c = new RoleController();

router.post('/', (q, r) => c.create(q, r));
router.get('/', (q, r) => c.findAll(q, r));
router.get('/:id', (q, r) => c.findById(q, r));
router.put('/:id', (q, r) => c.update(q, r));

export default router;
