import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { routeHandler } from '../utils/route-utils';

const router = Router();

// Public routes
router.post('/login', routeHandler(userController.login));

// Protected routes
router.use(authMiddleware);

// User management routes
router.route('/')
  .post(routeHandler(userController.createUser))
  .get(routeHandler(userController.getAllUsers));

router.route('/:id')
  .get(routeHandler(userController.getUserById))
  .patch(routeHandler(userController.updateUser))
  .delete(routeHandler(userController.deleteUser));

export default router; 