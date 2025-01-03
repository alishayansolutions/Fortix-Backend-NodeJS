import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { routeHandler } from '../utils/route-utils';
import { validate } from '../middleware/validation.middleware';
import { userValidation } from '../validations/user.schema';

const router = Router();

// Public routes
router.post(
  '/login',
  validate(userValidation.login),
  routeHandler(userController.login)
);

// Protected routes
router.use(authMiddleware);

// User management routes
router.route('/')
  .post(
    validate(userValidation.createUser),
    routeHandler(userController.createUser)
  )
  .get(
    routeHandler(userController.getAllUsers)
  );

router.route('/:id')
  .get(
    validate(userValidation.getUserById),
    routeHandler(userController.getUserById)
  )
  .patch(
    validate(userValidation.updateUser),
    routeHandler(userController.updateUser)
  )
  .delete(
    validate(userValidation.deleteUser),
    routeHandler(userController.deleteUser)
  );

export default router; 