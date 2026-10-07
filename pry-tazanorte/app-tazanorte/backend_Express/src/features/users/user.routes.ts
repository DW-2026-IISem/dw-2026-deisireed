import { Router } from 'express';
import { UserController } from './controllers/user.controller';

const router = Router();
const userController = new UserController();

router.get('/', (req, res) => userController.findAll(req, res));
router.get('/:id', (req, res) => userController.findById(req, res));

export default router;
