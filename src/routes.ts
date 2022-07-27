import { Router } from 'express';
import { AuthenticateUserController } from './useCases/authenticateUser/AuthenticateUserContoller';
import { CreateUserController } from './useCases/createUser/CreateUserController';

const router = Router();

const authenticateUserContoller = new AuthenticateUserController();
const createUserController = new CreateUserController();

router.post('/login', authenticateUserContoller.handle);
router.post('/users', createUserController.handle);

export { router }