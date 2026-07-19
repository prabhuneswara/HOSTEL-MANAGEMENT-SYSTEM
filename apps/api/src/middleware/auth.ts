import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'hostelhub-super-secret-jwt-key-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'STUDENT' | 'WARDEN' | 'STAFF' | 'ADMIN';
    firstName: string;
    lastName: string;
  };
}

export function checkAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token missing or invalid', 'UNAUTHORIZED', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Session expired or token invalid', 'UNAUTHORIZED', 401);
  }
}

export function checkRole(allowedRoles: ('STUDENT' | 'WARDEN' | 'STAFF' | 'ADMIN')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 'UNAUTHORIZED', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res, 
        `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`, 
        'FORBIDDEN', 
        403
      );
    }

    next();
  };
}
