import User, { UserType } from '../models/User';
import { UserRepository, IUserRepository } from '../repositories/UserRepository';
import { BaseService, IBaseService } from './BaseService';

export interface IUserService extends IBaseService<User> {
    Insert(userData: {
        name: string;
        email: string;
        login: string;
        password: string;
        type: UserType;
    }): Promise<User>;
    Update(id: number, userData: Partial<{
        name: string;
        email: string;
        login: string;
        password: string;
        type: UserType;
    }>): Promise<User | null>;
    ValidateUserData(userData: any): void;
    GetByLogin(login: string): Promise<User | null>;
}

export class UserService extends BaseService<User> implements IUserService {
    private userRepository: IUserRepository;

    constructor() {
        const userRepository = new UserRepository();
        super(userRepository);
        this.userRepository = userRepository;
    }

    async Insert(userData: {
        name: string;
        email: string;
        login: string;
        password: string;
        type: UserType;
    }): Promise<User> {
        try {
            this.ValidateUserData(userData);
            return await this.userRepository.Insert(userData);
        } catch (error) {
            throw new Error(`UserService error creating user: ${error}`);
        }
    }

    async Update(id: number, userData: Partial<{
        name: string;
        email: string;
        login: string;
        password: string;
        type: UserType;
    }>): Promise<User | null> {
        try {
            if (Object.keys(userData).length === 0) {
                throw new Error('No update data provided');
            }
            
            return await this.userRepository.Update(id, userData);
        } catch (error) {
            throw new Error(`UserService error updating user: ${error}`);
        }
    }

    async GetByLogin(login: string): Promise<User | null> {
        return await this.userRepository.GetByLogin(login);
    }

    ValidateUserData(userData: any): void {
        if (!userData.name || userData.name.trim().length === 0) {
            throw new Error('Name is required');
        }
        
        if (!userData.email || userData.email.trim().length === 0) {
            throw new Error('Email is required');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }
        
        if (!userData.login || userData.login.trim().length === 0) {
            throw new Error('Login is required');
        }
        
        if (!userData.password || userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        if (!userData.type || !Object.values(UserType).includes(userData.type)) {
            throw new Error('Invalid user type');
        }
    }
} 