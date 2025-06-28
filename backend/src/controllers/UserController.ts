import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService, IUserService } from '../services/UserService';
import User, { UserType } from '../models/User';

export class UserController extends BaseController<User> {
    private userService: IUserService;

    constructor() {
        const userService = new UserService();
        super(userService);
        this.userService = userService;
    }

    async registerAluno(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, login, password} = req.body;

            if (!name || !email || !login || !password ) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: name, email, login, password'
                });

                return;
            }

            const userData = {
                name,
                email,
                login,
                password,
                type: UserType.ALUNO
            };

            const user = await this.userService.Insert(userData);

            res.status(201).json({
                success: true,
                data: user,
                message: 'User created successfully'
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }
    
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, login, password, type } = req.body;

            if (!name || !email || !login || !password || !type) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: name, email, login, password, type'
                });
                return;
            }

            const userData = {
                name,
                email,
                login,
                password,
                type: type as UserType
            };

            const user = await this.userService.Insert(userData);

            res.status(201).json({
                success: true,
                data: user,
                message: 'User created successfully'
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

            const { name, email, login, password, type } = req.body;

            if (!name && !email && !login && !password && !type) {
                res.status(400).json({
                    success: false,
                    message: 'At least one field must be provided for update'
                });
                return;
            }

            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;
            if (login !== undefined) updateData.login = login;
            if (password !== undefined) updateData.password = password;
            if (type !== undefined) updateData.type = type as UserType;

            const user = await this.userService.Update(id, updateData);

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: user,
                message: 'User updated successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.query;
            
            let users = await this.userService.GetAll();
            
            if (type && Object.values(UserType).includes(type as UserType)) {
                users = users.filter(user => user.type === type);
            }

            res.status(200).json({
                success: true,
                data: users,
                message: 'Users retrieved successfully'
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