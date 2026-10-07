import { Router } from 'express';
import { ResourceRoleController } from './controllers/resource-role.controller';

const router = Router();
const c = new ResourceRoleController();

router.post('/assign', (q, r) => c.assign(q, r));
router.post('/remove', (q, r) => c.remove(q, r));

export default router;
