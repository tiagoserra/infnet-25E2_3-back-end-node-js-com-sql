import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// GET /users - Get all users (with optional type filter)
router.get('/', userController.getAllUsers.bind(userController));

// GET /users/:id - Get user by ID
router.get('/:id', userController.getById.bind(userController));

// POST /users - Create new user
router.post('/', userController.create.bind(userController));

// PUT /users/:id - Update user
router.put('/:id', userController.update.bind(userController));

// DELETE /users/:id - Delete user
router.delete('/:id', userController.delete.bind(userController));

export default router; 