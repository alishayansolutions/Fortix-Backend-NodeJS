import { Router } from 'express';
import adminRoutes from './admin.routes';
import userRoutes from './user.routes';
import businessCaseRoutes from './business-case.routes';

const router = Router();

// API Routes
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/business-cases', businessCaseRoutes);

export default router; 