import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();
const userController = new UserController();

// GET /users - Get all users (with optional type filter) - Admin only
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers.bind(userController));

// GET /users/:id - Get user by ID - Admin only
router.get('/:id', authenticateToken, requireAdmin, userController.getById.bind(userController));

// POST /users - Create new user - Admin only
router.post('/', authenticateToken, requireAdmin, userController.create.bind(userController));

// PUT /users/:id - Update user - Admin only
router.put('/:id', authenticateToken, requireAdmin, userController.update.bind(userController));

// DELETE /users/:id - Delete user - Admin only
router.delete('/:id', authenticateToken, requireAdmin, userController.delete.bind(userController));

export default router; 