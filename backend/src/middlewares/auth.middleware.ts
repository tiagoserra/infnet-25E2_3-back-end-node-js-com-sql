import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

interface TokenPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'default_secret';
        const decoded = jwt.verify(token, secret) as TokenPayload;

        (req as any).user = decoded;

        return next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
}