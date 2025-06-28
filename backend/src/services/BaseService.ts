import { Model } from 'sequelize';
import { IBaseRepository } from '../repositories/BaseRepository';

export interface IBaseService<T> {
    GetAll(): Promise<T[]>;
    GetById(id: number): Promise<T | null>;
    Insert(data: any): Promise<T>;
    Delete(id: number): Promise<boolean>;
    Update(id: number, data: any): Promise<T | null>;
}

export abstract class BaseService<T extends Model> implements IBaseService<T> {
    protected repository: IBaseRepository<T>;

    constructor(repository: IBaseRepository<T>) {
        this.repository = repository;
    }

    async GetAll(): Promise<T[]> {
        try {
            return await this.repository.GetAll();
        } catch (error) {
            throw new Error(`Service error fetching all records: ${error}`);
        }
    }

    async GetById(id: number): Promise<T | null> {
        try {
            if (!id || id <= 0) {
                throw new Error('Invalid ID provided');
            }
            return await this.repository.GetById(id);
        } catch (error) {
            throw new Error(`Service error fetching record by id ${id}: ${error}`);
        }
    }

    async Insert(data: any): Promise<T> {
        try {
            if (!data) {
                throw new Error('No data provided for creation');
            }
            return await this.repository.Insert(data);
        } catch (error) {
            throw new Error(`Service error creating record: ${error}`);
        }
    }

    async Delete(id: number): Promise<boolean> {
        try {
            if (!id || id <= 0) {
                throw new Error('Invalid ID provided');
            }
            
            const existingRecord = await this.repository.GetById(id);
            if (!existingRecord) {
                throw new Error('Record not found');
            }
            
            return await this.repository.Delete(id);
        } catch (error) {
            throw new Error(`Service error deleting record with id ${id}: ${error}`);
        }
    }

    async Update(id: number, data: any): Promise<T | null> {
        try {
            if (!id || id <= 0) {
                throw new Error('Invalid ID provided');
            }
            
            if (!data) {
                throw new Error('No data provided for update');
            }
            
            const existingRecord = await this.repository.GetById(id);
            if (!existingRecord) {
                throw new Error('Record not found');
            }
            
            return await this.repository.Update(id, data);
        } catch (error) {
            throw new Error(`Service error updating record with id ${id}: ${error}`);
        }
    }
} 