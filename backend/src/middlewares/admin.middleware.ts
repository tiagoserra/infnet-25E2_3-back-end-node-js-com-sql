import { Request, Response, NextFunction } from 'express';
import User, { UserType } from '../models/User';
import CacheService from '../services/CacheService';
import { CacheUserDto } from '../dtos/cache.dto';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        iat: number;
        exp: number;
    };
}

export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não autenticado'
            });
        }

        const userId = parseInt(req.user.id);
        const userCacheKey = CacheService.generateUserCacheKey(userId);
 
        let cachedUserResult = await CacheService.getByKey<CacheUserDto>(userCacheKey);
        let userDto: CacheUserDto | null = null;

        if (cachedUserResult.success && cachedUserResult.data) {
            userDto = cachedUserResult.data;
        } else {

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            userDto = {
                id: user.id,
                name: user.name,
                email: user.email,
                login: user.login,
                type: user.type
            };

            await CacheService.setByKey(userCacheKey, userDto);
        }

        if (userDto.type !== UserType.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
            });
        }

        return next();
    } catch (error) {
        console.error('Erro no middleware admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
} 