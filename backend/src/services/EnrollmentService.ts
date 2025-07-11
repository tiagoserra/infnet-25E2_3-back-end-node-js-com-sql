import Enrollment, { EnrollmentStatus } from '../models/Enrollment';
import { EnrollmentRepository, IEnrollmentRepository } from '../repositories/EnrollmentRepository';
import { BaseService, IBaseService } from './BaseService';
import { CourseRepository } from '../repositories/CourseRepository';
import Course from '../models/Course';

export interface EnrollmentWithCourse {
    id: number;
    enrollDate: Date;
    conclusionDate?: Date;
    userId: number;
    courseId: number;
    status: EnrollmentStatus;
    course: Course;
}

export interface IEnrollmentService extends IBaseService<Enrollment> {
    Insert(enrollmentData: {
        enrollDate: Date;
        conclusionDate?: Date;
        userId: number;
        courseId: number;
        status: EnrollmentStatus;
    }): Promise<Enrollment>;
    Update(id: number, enrollmentData: Partial<{
        enrollDate: Date;
        conclusionDate?: Date;
        userId: number;
        courseId: number;
        status: EnrollmentStatus;
    }>): Promise<Enrollment | null>;
    ValidateEnrollmentData(enrollmentData: any): void;
    ConcludeEnrollment(id: number): Promise<Enrollment | null>;
    CancelEnrollment(id: number): Promise<boolean>;
    GetUserEnrolledCourses(userId: number): Promise<EnrollmentWithCourse[]>;
}

export class EnrollmentService extends BaseService<Enrollment> implements IEnrollmentService {
    private enrollmentRepository: IEnrollmentRepository;
    private courseRepository: CourseRepository;

    constructor() {
        const enrollmentRepository = new EnrollmentRepository();
        super(enrollmentRepository);
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = new CourseRepository();
    }

    async Insert(enrollmentData: {
        enrollDate: Date;
        conclusionDate?: Date;
        userId: number;
        courseId: number;
        status: EnrollmentStatus;
    }): Promise<Enrollment> {
        try {
            this.ValidateEnrollmentData(enrollmentData);
            return await this.enrollmentRepository.Insert(enrollmentData);
        } catch (error) {
            throw new Error(`EnrollmentService error creating enrollment: ${error}`);
        }
    }

    async Update(id: number, enrollmentData: Partial<{
        enrollDate: Date;
        conclusionDate?: Date;
        userId: number;
        courseId: number;
        status: EnrollmentStatus;
    }>): Promise<Enrollment | null> {
        try {
            if (Object.keys(enrollmentData).length === 0) {
                throw new Error('No update data provided');
            }
            
            // Validate conclusion date if provided
            if (enrollmentData.conclusionDate && enrollmentData.enrollDate) {
                if (enrollmentData.conclusionDate <= enrollmentData.enrollDate) {
                    throw new Error('Conclusion date must be after enrollment date');
                }
            }
            
            return await this.enrollmentRepository.Update(id, enrollmentData);
        } catch (error) {
            throw new Error(`EnrollmentService error updating enrollment: ${error}`);
        }
    }

    async ConcludeEnrollment(id: number): Promise<Enrollment | null> {
        try {
            const updateData = {
                status: EnrollmentStatus.CONCLUDED,
                conclusionDate: new Date()
            };
            
            return await this.enrollmentRepository.Update(id, updateData);
        } catch (error) {
            throw new Error(`EnrollmentService error concluding enrollment: ${error}`);
        }
    }

    async CancelEnrollment(id: number): Promise<boolean> {
        try {
            return await this.enrollmentRepository.Delete(id);
        } catch (error) {
            throw new Error(`EnrollmentService error canceling enrollment: ${error}`);
        }
    }

    ValidateEnrollmentData(enrollmentData: any): void {
        if (!enrollmentData.userId || enrollmentData.userId <= 0) {
            throw new Error('Valid user ID is required');
        }
        
        if (!enrollmentData.courseId || enrollmentData.courseId <= 0) {
            throw new Error('Valid course ID is required');
        }
        
        if (!enrollmentData.enrollDate) {
            throw new Error('Enrollment date is required');
        }
        
        const enrollDate = new Date(enrollmentData.enrollDate);
        if (isNaN(enrollDate.getTime())) {
            throw new Error('Invalid enrollment date format');
        }
        
        if (!enrollmentData.status || !Object.values(EnrollmentStatus).includes(enrollmentData.status)) {
            throw new Error('Invalid enrollment status');
        }
        
        // Validate conclusion date if provided
        if (enrollmentData.conclusionDate) {
            const conclusionDate = new Date(enrollmentData.conclusionDate);
            if (isNaN(conclusionDate.getTime())) {
                throw new Error('Invalid conclusion date format');
            }
            
            if (conclusionDate <= enrollDate) {
                throw new Error('Conclusion date must be after enrollment date');
            }
        }
    }

    async GetUserEnrolledCourses(userId: number): Promise<EnrollmentWithCourse[]> {
        try {
            // Get all enrollments for the user
            const allEnrollments = await this.enrollmentRepository.GetAll();
            const userEnrollments = allEnrollments.filter(enrollment => enrollment.userId === userId);
            
            if (userEnrollments.length === 0) {
                return [];
            }
            
            // Get all courses
            const allCourses = await this.courseRepository.GetAll();
            
            // Join enrollments with courses
            const enrolledCourses: EnrollmentWithCourse[] = [];
            
            for (const enrollment of userEnrollments) {
                const course = allCourses.find(c => c.id === enrollment.courseId);
                if (course) {
                    enrolledCourses.push({
                        id: enrollment.id,
                        enrollDate: enrollment.enrollDate,
                        conclusionDate: enrollment.conclusionDate,
                        userId: enrollment.userId,
                        courseId: enrollment.courseId,
                        status: enrollment.status,
                        course
                    });
                }
            }
            
            return enrolledCourses;
        } catch (error) {
            throw new Error(`EnrollmentService error getting user enrolled courses: ${error}`);
        }
    }
} 