import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('🔥 Server Error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal error occurred';
  const code = err.code || 'INTERNAL_ERROR';
  const details = err.details || undefined;

  return sendError(res, message, code, statusCode, details);
}
