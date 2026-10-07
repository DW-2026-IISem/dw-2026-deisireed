import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';

const router = Router();
const c = new AuthController();

router.post('/login', (q, r) => c.login(q, r));
router.post('/refresh', (q, r) => c.refresh(q, r));
router.post('/logout', (q, r) => c.logout(q, r));

export default router;
