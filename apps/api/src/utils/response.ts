import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

export function sendError(
  res: Response, 
  message: string, 
  code = 'INTERNAL_ERROR', 
  statusCode = 500, 
  details?: any[]
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details
    }
  });
}
