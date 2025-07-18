import { Quotation, QuotationStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { MapsService, LocationCoordinates } from './maps.service';
import { ZoneService } from './zone.service';
import { PricingService } from './pricing.service';
import { constants } from '../config/constants';

interface CreateQuotationData {
  userId?: string;
  serviceId: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  requestedDate: Date;
  passengerCount: number;
  specialRequirements?: string;
}

interface QuotationResult extends Quotation {
  formattedPrice: string;
  expiresIn: string;
  service: {
    id: string;
    name: string;
    description: string | null;
  };
}

export class QuotationService {
  private mapsService: MapsService;
  private zoneService: ZoneService;
  private pricingService: PricingService;

  constructor() {
    this.mapsService = new MapsService();
    this.zoneService = new ZoneService();
    this.pricingService = new PricingService();
  }

  async createQuotation(data: CreateQuotationData): Promise<QuotationResult> {
    // Validate requested date
    const now = new Date();
    if (data.requestedDate < now) {
      throw new Error('La fecha de recogida debe ser futura');
    }

    // Validate passenger count
    const service = await this.pricingService.getService(data.serviceId);
    if (data.passengerCount > service.maxPassengers) {
      throw new Error(`Este servicio permite máximo ${service.maxPassengers} pasajeros`);
    }

    // Calculate route
    const routeInfo = await this.mapsService.calculateRoute(
      { lat: data.pickupLat, lng: data.pickupLng },
      { lat: data.dropoffLat, lng: data.dropoffLng }
    );

    // Check zones
    const zoneSurcharges = await this.zoneService.getMultipleZoneSurcharges(
      { lat: data.pickupLat, lng: data.pickupLng },
      { lat: data.dropoffLat, lng: data.dropoffLng }
    );

    // Calculate price
    const priceCalculation = await this.pricingService.calculatePrice({
      serviceId: data.serviceId,
      distanceKm: routeInfo.distance / 1000,
      durationMinutes: Math.round(routeInfo.duration / 60),
      pickupTime: data.requestedDate,
      zoneSurchargePercentage: zoneSurcharges.totalSurchargePercentage,
      zoneSurchargeFixed: zoneSurcharges.totalSurchargeFixed,
    });

    // Set expiration time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + constants.QUOTATION_EXPIRY_MINUTES);

    // Create quotation
    const quotation = await prisma.quotation.create({
      data: {
        userId: data.userId,
        serviceId: data.serviceId,
        pickupAddress: data.pickupAddress,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        dropoffAddress: data.dropoffAddress,
        dropoffLat: data.dropoffLat,
        dropoffLng: data.dropoffLng,
        distanceKm: routeInfo.distance / 1000,
        durationMinutes: Math.round(routeInfo.duration / 60),
        basePrice: priceCalculation.basePrice,
        distancePrice: priceCalculation.distancePrice,
        timePrice: priceCalculation.timePrice,
        surgePrice: priceCalculation.surgePrice,
        discounts: priceCalculation.discounts,
        totalPrice: priceCalculation.totalPrice,
        priceBreakdown: {
          ...priceCalculation,
          routeInfo,
          zones: {
            pickup: zoneSurcharges.pickupZone?.name || null,
            dropoff: zoneSurcharges.dropoffZone?.name || null,
          },
        },
        requestedDate: data.requestedDate,
        passengerCount: data.passengerCount,
        specialRequirements: data.specialRequirements,
        status: QuotationStatus.PENDING,
        expiresAt,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return {
      ...quotation,
      formattedPrice: this.formatPrice(quotation.totalPrice.toNumber()),
      expiresIn: `${constants.QUOTATION_EXPIRY_MINUTES} minutos`,
    };
  }

  async getQuotation(quotationId: string): Promise<QuotationResult | null> {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!quotation) {
      return null;
    }

    // Check if expired
    if (quotation.expiresAt < new Date() && quotation.status === QuotationStatus.PENDING) {
      await prisma.quotation.update({
        where: { id: quotationId },
        data: { status: QuotationStatus.EXPIRED },
      });
      quotation.status = QuotationStatus.EXPIRED;
    }

    const remainingMinutes = Math.max(
      0,
      Math.round((quotation.expiresAt.getTime() - Date.now()) / 60000)
    );

    return {
      ...quotation,
      formattedPrice: this.formatPrice(quotation.totalPrice.toNumber()),
      expiresIn: quotation.status === QuotationStatus.EXPIRED 
        ? 'Expirada' 
        : `${remainingMinutes} minutos`,
    };
  }

  async getUserQuotations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [quotations, total] = await Promise.all([
      prisma.quotation.findMany({
        where: { userId },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.quotation.count({ where: { userId } }),
    ]);

    // Update expired quotations
    const now = new Date();
    const expiredIds = quotations
      .filter(q => q.expiresAt < now && q.status === QuotationStatus.PENDING)
      .map(q => q.id);

    if (expiredIds.length > 0) {
      await prisma.quotation.updateMany({
        where: { id: { in: expiredIds } },
        data: { status: QuotationStatus.EXPIRED },
      });
    }

    const formattedQuotations = quotations.map(q => ({
      ...q,
      formattedPrice: this.formatPrice(q.totalPrice.toNumber()),
      expiresIn: q.status === QuotationStatus.EXPIRED 
        ? 'Expirada' 
        : `${Math.max(0, Math.round((q.expiresAt.getTime() - Date.now()) / 60000))} minutos`,
    }));

    return {
      quotations: formattedQuotations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async acceptQuotation(quotationId: string, userId?: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      throw new Error('Cotización no encontrada');
    }

    // Verify ownership if userId provided
    if (userId && quotation.userId && quotation.userId !== userId) {
      throw new Error('No autorizado');
    }

    // Check if expired
    if (quotation.expiresAt < new Date()) {
      throw new Error('La cotización ha expirado');
    }

    // Check if already accepted
    if (quotation.status !== QuotationStatus.PENDING) {
      throw new Error('La cotización ya no está disponible');
    }

    // Update status
    const updatedQuotation = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: QuotationStatus.ACCEPTED },
    });

    return updatedQuotation;
  }

  async quickQuote(
    serviceId: string,
    pickupCoords: LocationCoordinates,
    dropoffCoords: LocationCoordinates
  ) {
    // Calculate route
    const routeInfo = await this.mapsService.calculateRoute(pickupCoords, dropoffCoords);

    // Check zones
    const zoneSurcharges = await this.zoneService.getMultipleZoneSurcharges(
      pickupCoords,
      dropoffCoords
    );

    // Calculate price for now
    const priceNow = await this.pricingService.calculatePrice({
      serviceId,
      distanceKm: routeInfo.distance / 1000,
      durationMinutes: Math.round(routeInfo.duration / 60),
      pickupTime: new Date(),
      zoneSurchargePercentage: zoneSurcharges.totalSurchargePercentage,
      zoneSurchargeFixed: zoneSurcharges.totalSurchargeFixed,
    });

    // Get service details
    const service = await this.pricingService.getService(serviceId);

    return {
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        maxPassengers: service.maxPassengers,
      },
      route: {
        distance: routeInfo.distanceText,
        duration: routeInfo.durationText,
        distanceKm: routeInfo.distance / 1000,
        durationMinutes: Math.round(routeInfo.duration / 60),
      },
      pricing: {
        totalPrice: priceNow.totalPrice,
        formattedPrice: this.formatPrice(priceNow.totalPrice),
        surgeActive: priceNow.surgeMultiplier > 1,
        surgeMultiplier: priceNow.surgeMultiplier,
        breakdown: priceNow.breakdown,
      },
      zones: {
        pickup: zoneSurcharges.pickupZone?.name || null,
        dropoff: zoneSurcharges.dropoffZone?.name || null,
      },
      validFor: `${constants.QUOTATION_EXPIRY_MINUTES} minutos`,
    };
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  }

  async formatQuotationForWhatsApp(quotation: QuotationResult): string {
    const priceBreakdown = quotation.priceBreakdown as any;
    
    const message = `
🚗 *COTIZACIÓN PRIVATELIMO*

📍 *Recorrido:*
Desde: ${quotation.pickupAddress}
Hasta: ${quotation.dropoffAddress}

📊 *Detalles del viaje:*
• Distancia: ${priceBreakdown.routeInfo.distanceText}
• Duración estimada: ${priceBreakdown.routeInfo.durationText}
• Servicio: ${quotation.service.name}
• Pasajeros: ${quotation.passengerCount}

💰 *Precio Total: ${quotation.formattedPrice}*

📅 Fecha solicitada: ${new Date(quotation.requestedDate).toLocaleString('es-AR')}

⏱️ Esta cotización es válida por ${quotation.expiresIn}

Para confirmar su reserva, responda "CONFIRMAR" o contáctenos al +1234567890

_Gracias por elegir PrivateLimo_
    `.trim();

    return message;
  }
}