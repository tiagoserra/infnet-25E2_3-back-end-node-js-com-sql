import User, { UserType } from '../models/User';
import { BaseRepository, IBaseRepository } from './BaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
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
    GetByLogin(login: string): Promise<User | null>;
}

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(User);
    }

    async GetByLogin(login: string): Promise<User | null> {
        return await User.findOne({ where: { login } });
    }
} 