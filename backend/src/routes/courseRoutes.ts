import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';

const router = Router();
const courseController = new CourseController();

// GET /courses - Get all courses
router.get('/', courseController.getAll.bind(courseController));

// GET /courses/active - Get active courses
router.get('/active', courseController.getActiveCourses.bind(courseController));

// GET /courses/date-range - Get courses by date range
router.get('/date-range', courseController.getCoursesByDateRange.bind(courseController));

// GET /courses/:id - Get course by ID
router.get('/:id', courseController.getById.bind(courseController));

// POST /courses - Create new course
router.post('/', courseController.create.bind(courseController));

// PUT /courses/:id - Update course
router.put('/:id', courseController.update.bind(courseController));

// DELETE /courses/:id - Delete course
router.delete('/:id', courseController.delete.bind(courseController));

export default router; 