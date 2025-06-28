import { Request, Response } from 'express';
import { UserService, IUserService } from '../services/UserService';
import User, { UserType } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginRequest {
    login: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    login: string;
    password: string;
    type?: UserType;
}

export class AuthController {
    private userService: IUserService;

    constructor() {
        this.userService = new UserService();
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, login, password, type = UserType.ALUNO }: RegisterRequest = req.body;

            if (!name || !email || !login || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: name, email, login, password'
                });
                return;
            }

            const existingUser = await this.userService.GetByLogin(login);

            if (existingUser) {
                res.status(409).json({
                    success: false,
                    message: 'User with this email or login already exists'
                });
                return;
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userData = {
                name,
                email,
                login,
                password: hashedPassword,
                type: UserType.ALUNO
            };

            const user = await this.userService.Insert(userData);

            // Remove password from response
            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                type: user.type
            };

            res.status(201).json({
                success: true,
                data: userResponse,
                message: 'User registered successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { login, password }: LoginRequest = req.body;

            if (!login || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Login and password are required'
                });
                return;
            }

            const user = await this.userService.GetByLogin(login);

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }

            const jwtSecret = process.env.JWT_SECRET || 'default_secret';
            const token = jwt.sign(
                {
                    id: user.id.toString(),
                    email: user.email,
                    login: user.login,
                    type: user.type
                },
                jwtSecret,
                { expiresIn: '24h' }
            );

            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                type: user.type
            };

            res.status(200).json({
                success: true,
                data: {
                    user: userResponse,
                    token,
                    expiresIn: '24h'
                },
                message: 'Login successful'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async me(req: Request, res: Response): Promise<void> {
        try {
            const userToken = (req as any).user;

            if (!userToken || !userToken.id) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }

            const user = await this.userService.GetById(parseInt(userToken.id));

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Remove password from response
            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                type: user.type
            };

            res.status(200).json({
                success: true,
                data: userResponse,
                message: 'User profile retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const userToken = (req as any).user;

            if (!userToken || !userToken.id) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }

            const user = await this.userService.GetById(parseInt(userToken.id));

            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Generate new JWT token
            const jwtSecret = process.env.JWT_SECRET || 'default_secret';
            const newToken = jwt.sign(
                {
                    id: user.id.toString(),
                    email: user.email,
                    login: user.login,
                    type: user.type
                },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                data: {
                    token: newToken,
                    expiresIn: '24h'
                },
                message: 'Token refreshed successfully'
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