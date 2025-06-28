import Course from '../models/Course';
import { BaseRepository, IBaseRepository } from './BaseRepository';

export interface ICourseRepository extends IBaseRepository<Course> {
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
}

export class CourseRepository extends BaseRepository<Course> implements ICourseRepository {
    constructor() {
        super(Course);
    }

    // Métodos específicos podem ser adicionados aqui se necessário
    // Os métodos GetAll, GetById, Insert, Delete e Update básicos 
    // já estão implementados no BaseRepository
} 