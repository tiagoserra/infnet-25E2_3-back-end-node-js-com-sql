import { Model, ModelStatic } from 'sequelize';

export interface IBaseRepository<T> {
    GetAll(): Promise<T[]>;
    GetById(id: number): Promise<T | null>;
    Insert(data: any): Promise<T>;
    Delete(id: number): Promise<boolean>;
    Update(id: number, data: any): Promise<T | null>;
}

export abstract class BaseRepository<T extends Model> implements IBaseRepository<T> {
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async GetAll(): Promise<T[]> {
        try {
            return await this.model.findAll();
        } catch (error) {
            throw new Error(`Error fetching ${this.model.name.toLowerCase()}s: ${error}`);
        }
    }

    async GetById(id: number): Promise<T | null> {
        try {
            return await this.model.findByPk(id);
        } catch (error) {
            throw new Error(`Error fetching ${this.model.name.toLowerCase()} by id ${id}: ${error}`);
        }
    }

    async Insert(data: any): Promise<T> {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw new Error(`Error creating ${this.model.name.toLowerCase()}: ${error}`);
        }
    }

    async Delete(id: number): Promise<boolean> {
        try {
            const deletedCount = await this.model.destroy({
                where: { id } as any
            });
            return deletedCount > 0;
        } catch (error) {
            throw new Error(`Error deleting ${this.model.name.toLowerCase()} with id ${id}: ${error}`);
        }
    }

    async Update(id: number, data: any): Promise<T | null> {
        try {
            const [updatedCount] = await this.model.update(data, {
                where: { id } as any
            });
            
            if (updatedCount === 0) {
                return null;
            }
            
            return await this.model.findByPk(id);
        } catch (error) {
            throw new Error(`Error updating ${this.model.name.toLowerCase()} with id ${id}: ${error}`);
        }
    }
} 