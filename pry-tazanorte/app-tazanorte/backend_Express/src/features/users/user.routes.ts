import { Router } from 'express';
import { UserController } from './controllers/user.controller';

const router = Router();
const c = new UserController();

router.post('/', (q, r) => c.create(q, r));
router.get('/', (q, r) => c.findAll(q, r));
router.get('/:id', (q, r) => c.findById(q, r));
router.put('/:id', (q, r) => c.update(q, r));
router.patch('/change-password', (q, r) => c.changePassword(q, r));
router.get('/:id/permissions', (q, r) => c.getPermissions(q, r));

export default router;
