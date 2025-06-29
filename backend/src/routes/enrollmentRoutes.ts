import { Router } from 'express';
import { EnrollmentController } from '../controllers/EnrollmentController';

const router = Router();
const enrollmentController = new EnrollmentController();

// GET /enrollments - Get all enrollments
router.get('/', enrollmentController.getAll.bind(enrollmentController));

// GET /enrollments/status - Get enrollments by status
router.get('/status', enrollmentController.getEnrollmentsByStatus.bind(enrollmentController));

// GET /enrollments/user/:userId/courses - Get enrolled courses with course details by user ID (must come before /user/:userId)
router.get('/user/:userId/courses', enrollmentController.getUserEnrolledCourses.bind(enrollmentController));

// GET /enrollments/user/:userId - Get enrollments by user ID
router.get('/user/:userId', enrollmentController.getEnrollmentsByUser.bind(enrollmentController));

// GET /enrollments/course/:courseId - Get enrollments by course ID
router.get('/course/:courseId', enrollmentController.getEnrollmentsByCourse.bind(enrollmentController));

// GET /enrollments/:id - Get enrollment by ID
router.get('/:id', enrollmentController.getById.bind(enrollmentController));

// POST /enrollments - Create new enrollment
router.post('/', enrollmentController.create.bind(enrollmentController));

// PUT /enrollments/:id - Update enrollment
router.put('/:id', enrollmentController.update.bind(enrollmentController));

// PATCH /enrollments/:id/conclude - Conclude enrollment
router.patch('/:id/conclude', enrollmentController.concludeEnrollment.bind(enrollmentController));

// PATCH /enrollments/:id/cancel - Cancel enrollment
router.patch('/:id/cancel', enrollmentController.cancelEnrollment.bind(enrollmentController));

// DELETE /enrollments/:id - Delete enrollment
router.delete('/:id', enrollmentController.delete.bind(enrollmentController));

export default router; 