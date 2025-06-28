import Course from '../models/Course';
import { CourseRepository, ICourseRepository } from '../repositories/CourseRepository';
import { BaseService, IBaseService } from './BaseService';

export interface ICourseService extends IBaseService<Course> {
    Insert(courseData: {
        name: string;
        description: string;
        cover?: string;
        startDate: Date;
        endDate: Date;
    }): Promise<Course>;
    Update(id: number, courseData: Partial<{
        name: string;
        description: string;
        cover?: string;
        startDate: Date;
        endDate: Date;
    }>): Promise<Course | null>;
    ValidateCourseData(courseData: any): void;
}

export class CourseService extends BaseService<Course> implements ICourseService {
    private courseRepository: ICourseRepository;

    constructor() {
        const courseRepository = new CourseRepository();
        super(courseRepository);
        this.courseRepository = courseRepository;
    }

    async Insert(courseData: {
        name: string;
        description: string;
        cover?: string;
        startDate: Date;
        endDate: Date;
    }): Promise<Course> {
        try {
            this.ValidateCourseData(courseData);
            return await this.courseRepository.Insert(courseData);
        } catch (error) {
            throw new Error(`CourseService error creating course: ${error}`);
        }
    }

    async Update(id: number, courseData: Partial<{
        name: string;
        description: string;
        cover?: string;
        startDate: Date;
        endDate: Date;
    }>): Promise<Course | null> {
        try {
            if (Object.keys(courseData).length === 0) {
                throw new Error('No update data provided');
            }
            
            // Validate dates if provided
            if (courseData.startDate && courseData.endDate) {
                if (courseData.startDate >= courseData.endDate) {
                    throw new Error('Start date must be before end date');
                }
            }
            
            return await this.courseRepository.Update(id, courseData);
        } catch (error) {
            throw new Error(`CourseService error updating course: ${error}`);
        }
    }

    ValidateCourseData(courseData: any): void {
        if (!courseData.name || courseData.name.trim().length === 0) {
            throw new Error('Course name is required');
        }
        
        if (!courseData.description || courseData.description.trim().length === 0) {
            throw new Error('Course description is required');
        }
        
        if (!courseData.startDate) {
            throw new Error('Start date is required');
        }
        
        if (!courseData.endDate) {
            throw new Error('End date is required');
        }
        
        const startDate = new Date(courseData.startDate);
        const endDate = new Date(courseData.endDate);
        
        if (isNaN(startDate.getTime())) {
            throw new Error('Invalid start date format');
        }
        
        if (isNaN(endDate.getTime())) {
            throw new Error('Invalid end date format');
        }
        
        if (startDate >= endDate) {
            throw new Error('Start date must be before end date');
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (startDate < today) {
            throw new Error('Start date cannot be in the past');
        }
    }
} 