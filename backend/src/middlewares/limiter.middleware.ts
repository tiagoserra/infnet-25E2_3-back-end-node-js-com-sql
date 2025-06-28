import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware de rate limiter que limita o número de requisições por IP
 * com base nos valores definidos no arquivo .env
 * 
 * RATE_LIMIT_MAX: Número máximo de requisições permitidas no período
 * RATE_LIMIT_WINDOW_MS: Período em milissegundos para reset do contador
 */
export const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Muitas requisições, por favor tente novamente mais tarde',
    },
    handler: (req: Request, res: Response, _: NextFunction, options: any) => {
        console.log(`Rate limit excedido para o IP: ${req.ip}`);
        res.status(429).json(options.message);
    },
});

export default rateLimiter;