import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { EnrollmentService, IEnrollmentService } from '../services/EnrollmentService';
import Enrollment, { EnrollmentStatus } from '../models/Enrollment';

export class EnrollmentController extends BaseController<Enrollment> {
    private enrollmentService: IEnrollmentService;

    constructor() {
        const enrollmentService = new EnrollmentService();
        super(enrollmentService);
        this.enrollmentService = enrollmentService;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { enrollDate, conclusionDate, userId, courseId, status } = req.body;

            if (!enrollDate || !userId || !courseId || !status) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: enrollDate, userId, courseId, status'
                });
                return;
            }

            const enrollmentData = {
                enrollDate: new Date(enrollDate),
                conclusionDate: conclusionDate ? new Date(conclusionDate) : undefined,
                userId: parseInt(userId),
                courseId: parseInt(courseId),
                status: status as EnrollmentStatus
            };

            const enrollment = await this.enrollmentService.Insert(enrollmentData);

            res.status(201).json({
                success: true,
                data: enrollment,
                message: 'Enrollment created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
                return;
            }

            const { enrollDate, conclusionDate, userId, courseId, status } = req.body;

            if (!enrollDate && !conclusionDate && !userId && !courseId && !status) {
                res.status(400).json({
                    success: false,
                    message: 'At least one field must be provided for update'
                });
                return;
            }

            const updateData: any = {};
            if (enrollDate !== undefined) updateData.enrollDate = new Date(enrollDate);
            if (conclusionDate !== undefined) updateData.conclusionDate = conclusionDate ? new Date(conclusionDate) : null;
            if (userId !== undefined) updateData.userId = parseInt(userId);
            if (courseId !== undefined) updateData.courseId = parseInt(courseId);
            if (status !== undefined) updateData.status = status as EnrollmentStatus;

            const enrollment = await this.enrollmentService.Update(id, updateData);

            if (!enrollment) {
                res.status(404).json({
                    success: false,
                    message: 'Enrollment not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: enrollment,
                message: 'Enrollment updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async concludeEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
                return;
            }

            const enrollment = await this.enrollmentService.ConcludeEnrollment(id);

            if (!enrollment) {
                res.status(404).json({
                    success: false,
                    message: 'Enrollment not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: enrollment,
                message: 'Enrollment concluded successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async cancelEnrollment(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
                return;
            }

            const enrollment = await this.enrollmentService.CancelEnrollment(id);

            if (!enrollment) {
                res.status(404).json({
                    success: false,
                    message: 'Enrollment not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: enrollment,
                message: 'Enrollment canceled successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    // Method to get enrollments by user ID
    async getEnrollmentsByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.params.userId);
            
            if (isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID format'
                });
                return;
            }

            const enrollments = await this.enrollmentService.GetAll();
            const userEnrollments = enrollments.filter(enrollment => enrollment.userId === userId);

            res.status(200).json({
                success: true,
                data: userEnrollments,
                message: 'User enrollments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    // Method to get enrollments by course ID
    async getEnrollmentsByCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseId = parseInt(req.params.courseId);
            
            if (isNaN(courseId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid course ID format'
                });
                return;
            }

            const enrollments = await this.enrollmentService.GetAll();
            const courseEnrollments = enrollments.filter(enrollment => enrollment.courseId === courseId);

            res.status(200).json({
                success: true,
                data: courseEnrollments,
                message: 'Course enrollments retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    // Method to get enrollments by status
    async getEnrollmentsByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.query;

            if (!status || !Object.values(EnrollmentStatus).includes(status as EnrollmentStatus)) {
                res.status(400).json({
                    success: false,
                    message: `Invalid status. Valid statuses are: ${Object.values(EnrollmentStatus).join(', ')}`
                });
                return;
            }

            const enrollments = await this.enrollmentService.GetAll();
            const statusEnrollments = enrollments.filter(enrollment => enrollment.status === status);

            res.status(200).json({
                success: true,
                data: statusEnrollments,
                message: `Enrollments with status '${status}' retrieved successfully`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
} 