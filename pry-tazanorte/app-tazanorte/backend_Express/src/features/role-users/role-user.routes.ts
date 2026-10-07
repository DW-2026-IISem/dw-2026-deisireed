import { Router } from 'express';
import { RoleUserController } from './controllers/role-user.controller';

const router = Router();
const c = new RoleUserController();

router.post('/assign', (q, r) => c.assign(q, r));
router.post('/remove', (q, r) => c.remove(q, r));

export default router;
