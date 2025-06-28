import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { CourseService, ICourseService } from '../services/CourseService';
import Course from '../models/Course';

export class CourseController extends BaseController<Course> {
    private courseService: ICourseService;

    constructor() {
        const courseService = new CourseService();
        super(courseService);
        this.courseService = courseService;
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, cover, startDate, endDate } = req.body;

            if (!name || !description || !startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: name, description, startDate, endDate'
                });
                return;
            }

            const courseData = {
                name,
                description,
                cover: cover || undefined,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };

            const course = await this.courseService.Insert(courseData);

            res.status(201).json({
                success: true,
                data: course,
                message: 'Course created successfully'
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

            const { name, description, cover, startDate, endDate } = req.body;

            if (!name && !description && cover === undefined && !startDate && !endDate) {
                res.status(400).json({
                    success: false,
                    message: 'At least one field must be provided for update'
                });
                return;
            }

            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (cover !== undefined) updateData.cover = cover;
            if (startDate !== undefined) updateData.startDate = new Date(startDate);
            if (endDate !== undefined) updateData.endDate = new Date(endDate);

            const course = await this.courseService.Update(id, updateData);

            if (!course) {
                res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: course,
                message: 'Course updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async getActiveCourses(req: Request, res: Response): Promise<void> {
        try {
            const courses = await this.courseService.GetAll();
            const now = new Date();
            
            const activeCourses = courses.filter(course => {
                return new Date(course.endDate) >= now;
            });

            res.status(200).json({
                success: true,
                data: activeCourses,
                message: 'Active courses retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async getCoursesByDateRange(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    message: 'Both startDate and endDate query parameters are required'
                });
                return;
            }

            const courses = await this.courseService.GetAll();
            const filterStartDate = new Date(startDate as string);
            const filterEndDate = new Date(endDate as string);

            if (isNaN(filterStartDate.getTime()) || isNaN(filterEndDate.getTime())) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
                return;
            }

            const filteredCourses = courses.filter(course => {
                const courseStart = new Date(course.startDate);
                const courseEnd = new Date(course.endDate);
                
                return (courseStart >= filterStartDate && courseStart <= filterEndDate) ||
                       (courseEnd >= filterStartDate && courseEnd <= filterEndDate) ||
                       (courseStart <= filterStartDate && courseEnd >= filterEndDate);
            });

            res.status(200).json({
                success: true,
                data: filteredCourses,
                message: 'Courses retrieved successfully'
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