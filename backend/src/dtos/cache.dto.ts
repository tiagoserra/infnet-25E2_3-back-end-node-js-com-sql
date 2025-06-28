import { UserType } from '../models/User';

export interface CacheUserDto {
    id: number;
    name: string;
    email: string;
    login: string;
    type: UserType;
}

export interface CacheGetDto<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface CacheSetDto {
    success: boolean;
    error?: string;
}

export interface CacheDeleteDto {
    success: boolean;
    error?: string;
} 