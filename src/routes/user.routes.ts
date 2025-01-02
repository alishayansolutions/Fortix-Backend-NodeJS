import { Router, Response, NextFunction } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// All routes require admin authentication
router.use(authMiddleware);

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userController.createUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userController.getUserById(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userController.updateUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await userController.deleteUser(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 