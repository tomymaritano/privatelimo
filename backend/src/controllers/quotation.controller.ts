import { Request, Response, NextFunction } from 'express';
import { QuotationService } from '../services/quotation.service';
import { AuthRequest } from '../types/auth';

const quotationService = new QuotationService();

export class QuotationController {
  async createQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const quotationData = {
        ...req.body,
        userId: req.user?.id,
      };

      const quotation = await quotationService.createQuotation(quotationData);
      
      res.status(201).json({
        success: true,
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const { quotationId } = req.params;
      const quotation = await quotationService.getQuotation(quotationId);
      
      if (!quotation) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Cotización no encontrada',
          },
        });
      }
      
      res.json({
        success: true,
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserQuotations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Usuario no autenticado',
          },
        });
      }
      
      const result = await quotationService.getUserQuotations(
        req.user.id,
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

  async acceptQuotation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { quotationId } = req.params;
      
      const updatedQuotation = await quotationService.acceptQuotation(
        quotationId,
        req.user?.id
      );
      
      res.json({
        success: true,
        data: updatedQuotation,
        message: 'Cotización aceptada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async quickQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, pickupLat, pickupLng, dropoffLat, dropoffLng } = req.query;
      
      if (!serviceId || !pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Parámetros requeridos: serviceId, pickupLat, pickupLng, dropoffLat, dropoffLng',
          },
        });
      }
      
      const quote = await quotationService.quickQuote(
        serviceId as string,
        { lat: Number(pickupLat), lng: Number(pickupLng) },
        { lat: Number(dropoffLat), lng: Number(dropoffLng) }
      );
      
      res.json({
        success: true,
        data: quote,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuotationWhatsApp(req: Request, res: Response, next: NextFunction) {
    try {
      const { quotationId } = req.params;
      
      const quotation = await quotationService.getQuotation(quotationId);
      
      if (!quotation) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Cotización no encontrada',
          },
        });
      }
      
      const whatsappMessage = await quotationService.formatQuotationForWhatsApp(quotation);
      
      res.json({
        success: true,
        data: {
          message: whatsappMessage,
          phoneNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '+1234567890',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async estimatePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, distanceKm } = req.query;
      
      if (!serviceId || !distanceKm) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Parámetros requeridos: serviceId, distanceKm',
          },
        });
      }
      
      const pricingService = quotationService['pricingService'];
      const estimate = await pricingService.estimatePriceRange(
        serviceId as string,
        Number(distanceKm)
      );
      
      res.json({
        success: true,
        data: estimate,
      });
    } catch (error) {
      next(error);
    }
  }

  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const pricingService = quotationService['pricingService'];
      const services = await pricingService.getServices();
      
      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }
}