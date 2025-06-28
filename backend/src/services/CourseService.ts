import Course from '../models/Course';
import { CourseRepository, ICourseRepository } from '../repositories/CourseRepository';
import { BaseService, IBaseService } from './BaseService';
import cacheService from "./CacheService";

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

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
    GetPaginated(page: number, limit: number, searchName?: string): Promise<PaginatedResult<Course>>;
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

    async GetPaginated(page: number = 1, limit: number = 25, searchName?: string): Promise<PaginatedResult<Course>> {
        try {
            if (page < 1) page = 1;
            if (limit < 1 || limit > 100) limit = 25;

            // Create cache key
            const searchKey = searchName ? `_search_${searchName.trim().toLowerCase()}` : '';
            const cacheKey = `courses_paginated_page_${page}_limit_${limit}${searchKey}`;

            // Try to get from cache first
            const cachedResult = await cacheService.getByKey<PaginatedResult<Course>>(cacheKey);
            if (cachedResult.success && cachedResult.data) {
                return cachedResult.data;
            }

            const offset = (page - 1) * limit;

            // Get all courses from repository
            const allCourses = await this.courseRepository.GetAll();
            
            // Filter by name if search term provided
            let filteredCourses = allCourses;
            if (searchName && searchName.trim()) {
                const searchTerm = searchName.trim().toLowerCase();
                filteredCourses = allCourses.filter(course => 
                    course.name.toLowerCase().includes(searchTerm)
                );
            }

            const total = filteredCourses.length;
            const totalPages = Math.ceil(total / limit);
            const paginatedCourses = filteredCourses.slice(offset, offset + limit);

            const result: PaginatedResult<Course> = {
                data: paginatedCourses,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };

            // Cache the result for 5 minutes (300 seconds)
            await cacheService.setByKey(cacheKey, result, 300);

            return result;
        } catch (error) {
            throw new Error(`CourseService error fetching paginated courses: ${error}`);
        }
    }
} 