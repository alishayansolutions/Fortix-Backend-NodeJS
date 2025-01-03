import { Router } from 'express';
import * as businessCaseController from '../controllers/business-case.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { routeHandler } from '../utils/route-utils';
import { validate } from '../middleware/validation.middleware';
import { businessCaseValidation } from '../validations/business-case.schema';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.route('/')
  .post(
    validate(businessCaseValidation.createBusinessCase),
    routeHandler(businessCaseController.createBusinessCase)
  )
  .get(
    routeHandler(businessCaseController.getAllBusinessCases)
  );

router.route('/:id')
  .get(
    validate(businessCaseValidation.getBusinessCaseById),
    routeHandler(businessCaseController.getBusinessCaseById)
  )
  .patch(
    validate(businessCaseValidation.updateBusinessCase),
    routeHandler(businessCaseController.updateBusinessCase)
  )
  .delete(
    validate(businessCaseValidation.getBusinessCaseById),
    routeHandler(businessCaseController.deleteBusinessCase)
  );

export default router; 