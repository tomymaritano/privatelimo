import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { UserRole } from '@prisma/client';

const vehicleService = new VehicleService();

export class VehicleController {
  async createVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      
      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const vehicle = await vehicleService.updateVehicle(vehicleId, req.body);
      
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const vehicle = await vehicleService.getVehicle(vehicleId);
      
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category,
        status,
        driverId,
        minCapacity,
        page = 1,
        limit = 20,
      } = req.query;
      
      const filters = {
        category: category as any,
        status: status as any,
        driverId: driverId as string,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
      };
      
      const result = await vehicleService.getVehicles(
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

  async deleteVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const result = await vehicleService.deleteVehicle(vehicleId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const { driverId } = req.body;
      
      const vehicle = await vehicleService.assignDriver(vehicleId, driverId);
      
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async unassignDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const result = await vehicleService.unassignDriver(vehicleId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        pickupTime,
        duration,
        category,
        minCapacity,
      } = req.query;
      
      if (!pickupTime || !duration) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'pickupTime y duration son requeridos',
          },
        });
      }
      
      const vehicles = await vehicleService.getAvailableVehicles(
        new Date(pickupTime as string),
        Number(duration),
        category as any,
        minCapacity ? Number(minCapacity) : undefined
      );
      
      res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const { status } = req.body;
      
      const vehicle = await vehicleService.updateVehicleStatus(vehicleId, status);
      
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async addVehicleImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const { imageUrls } = req.body;
      
      const vehicle = await vehicleService.addVehicleImages(vehicleId, imageUrls);
      
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDriverVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { driverId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const vehicles = await vehicleService.getDriverVehicles(
        driverId,
        userId,
        userRole
      );
      
      res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }
}