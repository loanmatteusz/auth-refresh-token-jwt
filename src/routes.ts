import { Router } from 'express';
import { AuthenticateUserController } from './useCases/authenticateUser/AuthenticateUserContoller';
import { CreateUserController } from './useCases/createUser/CreateUserController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { RefreshTokenUserController } from './useCases/refreshTokenUser/RefreshTokenUserController';

const router = Router();

const authenticateUserContoller = new AuthenticateUserController();
const createUserController = new CreateUserController();
const refreshTokenUserController = new RefreshTokenUserController();

router.post('/login', authenticateUserContoller.handle);
router.post('/users', createUserController.handle);
router.post('/refresh-token', refreshTokenUserController.handle);

// Route for Auth token tests
router.get('/courses', ensureAuthenticated, (_, response) => {
  return response.json([
    { id: 1, courseName: 'NodeJS' },
    { id: 2, courseName: 'ReactJS' },
    { id: 3, courseName: 'AngularJS' },
    { id: 4, courseName: 'Flutter' },
    { id: 5, courseName: 'Elixir' },
  ]);
});

export { router }
