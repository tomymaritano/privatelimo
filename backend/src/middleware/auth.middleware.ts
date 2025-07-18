import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { ERROR_MESSAGES } from '../config/constants';
import { UserRole } from '@prisma/client';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'NO_TOKEN',
        },
      });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          message: ERROR_MESSAGES.TOKEN_INVALID,
          code: 'INVALID_TOKEN',
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        code: 'AUTH_ERROR',
      },
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'NO_USER',
        },
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'INSUFFICIENT_PERMISSIONS',
        },
      });
    }
    
    next();
  };
};

// Middleware to optionally authenticate (for routes that work with or without auth)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch (error) {
        // Token is invalid but we continue without user
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};