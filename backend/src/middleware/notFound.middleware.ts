import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.url}`,
      code: 'ROUTE_NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
};