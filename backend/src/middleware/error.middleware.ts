import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../config/constants';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  // Log error for debugging
  console.error(`Error ${statusCode}: ${message}`, {
    error: err,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    },
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details,
      }),
    },
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};