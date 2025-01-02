import { Router, Request, Response, NextFunction } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Admin auth routes
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminController.login(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/verify-2fa', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await adminController.verify2FA(req, res);
  } catch (error) {
    next(error);
  }
});


router.post('/enable-2fa', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await adminController.enable2FA(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/disable-2fa', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await adminController.disable2FA(req, res);
  } catch (error) {
    next(error);
  }
});

export default router; 