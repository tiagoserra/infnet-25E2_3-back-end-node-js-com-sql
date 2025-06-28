import { Request, Response } from 'express';
import { IBaseService } from '../services/BaseService';

export abstract class BaseController<T> {
    protected service: IBaseService<T>;

    constructor(service: IBaseService<T>) {
        this.service = service;
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const records = await this.service.GetAll();
            res.status(200).json({
                success: true,
                data: records,
                message: 'Records retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
                return;
            }

            const record = await this.service.GetById(id);
            
            if (!record) {
                res.status(404).json({
                    success: false,
                    message: 'Record not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: record,
                message: 'Record retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid ID format'
                });
                return;
            }

            const deleted = await this.service.Delete(id);
            
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Record not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Record deleted successfully'
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