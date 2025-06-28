import { Router } from 'express';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import enrollmentRoutes from './enrollmentRoutes';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Public routes (no authentication required)
router.post('/auth/login', authController.login.bind(authController));
router.post('/auth/register', authController.register.bind(authController));

// Protected routes
router.use('/users', authenticateToken, requireAdmin, userRoutes);
router.use('/courses', authenticateToken, courseRoutes);
router.use('/enrollments', authenticateToken, enrollmentRoutes);

export default router; 