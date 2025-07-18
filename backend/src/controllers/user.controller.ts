import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UserRole } from '@prisma/client';

const userService = new UserService();

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const profile = await userService.getProfile(userId);
      
      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.updateProfile(userId, req.body);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDriverProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.updateDriverProfile(userId, req.body);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { documentType, documentUrl } = req.body;
      
      const result = await userService.uploadDocument(userId, documentType, documentUrl);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await userService.getBookingHistory(
        userId,
        Number(page),
        Number(limit)
      );
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFavoriteAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const addresses = await userService.getFavoriteAddresses(userId);
      
      res.json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async addFavoriteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.addFavoriteAddress(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.deleteAccount(userId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverStats(req: Request, res: Response, next: NextFunction) {
    try {
      const driverId = req.params.driverId || req.user!.id;
      const stats = await userService.getDriverStats(driverId);
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { role, status, search, page = 1, limit = 20 } = req.query;
      
      const filters = {
        role: role as UserRole,
        status: status as string,
        search: search as string,
      };
      
      const result = await userService.getAllUsers(
        filters,
        Number(page),
        Number(limit)
      );
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await userService.getProfile(userId);
      
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}