import { Router } from 'express';
import adminRoutes from './admin.routes';
import userRoutes from './user.routes';

const router = Router();

// API Routes
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

export default router; 