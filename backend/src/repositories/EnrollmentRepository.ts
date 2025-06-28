import Enrollment, { EnrollmentStatus } from '../models/Enrollment';
import { BaseRepository, IBaseRepository } from './BaseRepository';

export interface IEnrollmentRepository extends IBaseRepository<Enrollment> {
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
}

export class EnrollmentRepository extends BaseRepository<Enrollment> implements IEnrollmentRepository {
    constructor() {
        super(Enrollment);
    }

    // Métodos específicos podem ser adicionados aqui se necessário
    // Os métodos GetAll, GetById, Insert, Delete e Update básicos 
    // já estão implementados no BaseRepository
} 