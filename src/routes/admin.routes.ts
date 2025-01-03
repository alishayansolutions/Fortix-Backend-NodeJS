import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { routeHandler } from '../utils/route-utils';
import { validate } from '../middleware/validation.middleware';
import { adminValidation } from '../validations/admin.schema';

const router = Router();

// Public routes
router.post(
  '/login',
  validate(adminValidation.login),
  routeHandler(adminController.login)
);

router.post(
  '/verify-2fa',
  validate(adminValidation.verify2FA),
  routeHandler(adminController.verify2FA)
);

// Protected routes
router.use(authMiddleware);

router.post(
  '/enable-2fa',
  routeHandler(adminController.enable2FA)
);

router.post(
  '/disable-2fa',
  routeHandler(adminController.disable2FA)
);

export default router; 