import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, data: { message: 'Access denied. No token provided.' } });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        res.status(500).json({ success: false, data: { message: 'JWT_SECRET is not configured.' } });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, data: { message: 'Invalid token.' } });
    }
};
