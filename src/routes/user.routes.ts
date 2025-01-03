import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { routeHandler } from '../utils/route-utils';

const router = Router();

// All routes require admin authentication
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