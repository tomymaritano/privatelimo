import { Request, Response, NextFunction } from 'express';
import { ZoneService } from '../services/zone.service';

const zoneService = new ZoneService();

export class ZoneController {
  async createZone(req: Request, res: Response, next: NextFunction) {
    try {
      const zone = await zoneService.createZone(req.body);
      
      res.status(201).json({
        success: true,
        data: zone,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zoneId } = req.params;
      const zone = await zoneService.updateZone(zoneId, req.body);
      
      res.json({
        success: true,
        data: zone,
      });
    } catch (error) {
      next(error);
    }
  }

  async getZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zoneId } = req.params;
      const zone = await zoneService.getZone(zoneId);
      
      res.json({
        success: true,
        data: zone,
      });
    } catch (error) {
      next(error);
    }
  }

  async getZones(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive, search, page = 1, limit = 20 } = req.query;
      
      const filters = {
        isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
        search: search as string,
      };
      
      const result = await zoneService.getZones(
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

  async deleteZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zoneId } = req.params;
      const result = await zoneService.deleteZone(zoneId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkPointInZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Latitud y longitud son requeridas',
          },
        });
      }
      
      const zone = await zoneService.checkPointInZone({
        lat: Number(lat),
        lng: Number(lng),
      });
      
      res.json({
        success: true,
        data: {
          inZone: !!zone,
          zone,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getZoneSurcharge(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Latitud y longitud son requeridas',
          },
        });
      }
      
      const surcharge = await zoneService.getZoneSurcharge({
        lat: Number(lat),
        lng: Number(lng),
      });
      
      res.json({
        success: true,
        data: surcharge,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveZonesGeoJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const geoJSON = await zoneService.getActiveZonesGeoJSON();
      
      res.json({
        success: true,
        data: geoJSON,
      });
    } catch (error) {
      next(error);
    }
  }
}