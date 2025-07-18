import { Service, PricingRule, RuleType, Decimal } from '@prisma/client';
import { prisma } from '../config/database';
import { constants } from '../config/constants';

interface PriceCalculation {
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  surgeMultiplier: number;
  surgePrice: number;
  zonesSurcharge: number;
  subtotal: number;
  discounts: number;
  totalPrice: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
  appliedRules: string[];
}

interface PricingFactors {
  serviceId: string;
  distanceKm: number;
  durationMinutes: number;
  pickupTime: Date;
  zoneSurchargePercentage?: number;
  zoneSurchargeFixed?: number;
  promocode?: string;
}

export class PricingService {
  async calculatePrice(factors: PricingFactors): Promise<PriceCalculation> {
    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: factors.serviceId },
      include: {
        pricingRules: {
          where: {
            isActive: true,
            OR: [
              { startDate: null, endDate: null },
              {
                startDate: { lte: factors.pickupTime },
                endDate: { gte: factors.pickupTime },
              },
              {
                startDate: { lte: factors.pickupTime },
                endDate: null,
              },
              {
                startDate: null,
                endDate: { gte: factors.pickupTime },
              },
            ],
          },
          orderBy: {
            priority: 'desc',
          },
        },
      },
    });

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    const breakdown: { description: string; amount: number }[] = [];
    const appliedRules: string[] = [];

    // Calculate base components
    const basePrice = service.basePrice.toNumber();
    const distancePrice = Math.max(
      factors.distanceKm * service.pricePerKm.toNumber(),
      service.minimumDistanceKm.toNumber() * service.pricePerKm.toNumber()
    );
    const timePrice = Math.max(
      factors.durationMinutes * service.pricePerMinute.toNumber(),
      service.minimumDurationMinutes * service.pricePerMinute.toNumber()
    );

    breakdown.push(
      { description: 'Tarifa base', amount: basePrice },
      { description: `Distancia (${factors.distanceKm.toFixed(1)} km)`, amount: distancePrice },
      { description: `Tiempo estimado (${factors.durationMinutes} min)`, amount: timePrice }
    );

    let subtotal = basePrice + distancePrice + timePrice;

    // Apply pricing rules
    let surgeMultiplier = 1;
    let additionalCharges = 0;
    let discountPercentage = 0;
    let discountFixed = 0;

    for (const rule of service.pricingRules) {
      const conditions = rule.conditions as any;
      let ruleApplies = false;

      switch (rule.ruleType) {
        case RuleType.SURGE:
          // Check if surge conditions apply
          if (conditions.timeRanges) {
            const hour = factors.pickupTime.getHours();
            for (const range of conditions.timeRanges) {
              if (hour >= range.start && hour <= range.end) {
                ruleApplies = true;
                break;
              }
            }
          }
          
          if (conditions.dayOfWeek) {
            const dayOfWeek = factors.pickupTime.getDay();
            if (conditions.dayOfWeek.includes(dayOfWeek)) {
              ruleApplies = true;
            }
          }

          if (ruleApplies) {
            surgeMultiplier = Math.max(surgeMultiplier, rule.multiplier.toNumber());
            appliedRules.push(`Tarifa dinámica: ${rule.name}`);
          }
          break;

        case RuleType.TIME_BASED:
          // Night surcharge
          const hour = factors.pickupTime.getHours();
          if (
            hour >= constants.NIGHT_HOURS_START ||
            hour < constants.NIGHT_HOURS_END
          ) {
            if (rule.fixedAmount) {
              additionalCharges += rule.fixedAmount.toNumber();
              breakdown.push({
                description: 'Recargo nocturno',
                amount: rule.fixedAmount.toNumber(),
              });
              appliedRules.push('Recargo nocturno');
            }
          }
          break;

        case RuleType.DISCOUNT:
          // Handle discounts (would be applied with promocodes)
          break;

        case RuleType.ZONE_BASED:
          // Already handled in zone service
          break;
      }
    }

    // Apply surge pricing
    const surgePrice = surgeMultiplier > 1 ? (subtotal * (surgeMultiplier - 1)) : 0;
    if (surgePrice > 0) {
      breakdown.push({
        description: `Tarifa dinámica (${surgeMultiplier}x)`,
        amount: surgePrice,
      });
    }

    // Apply zone surcharges
    let zonesSurcharge = 0;
    if (factors.zoneSurchargePercentage) {
      const percentageSurcharge = subtotal * (factors.zoneSurchargePercentage / 100);
      zonesSurcharge += percentageSurcharge;
      breakdown.push({
        description: `Recargo de zona (${factors.zoneSurchargePercentage}%)`,
        amount: percentageSurcharge,
      });
    }
    if (factors.zoneSurchargeFixed) {
      zonesSurcharge += factors.zoneSurchargeFixed;
      breakdown.push({
        description: 'Recargo de zona fijo',
        amount: factors.zoneSurchargeFixed,
      });
    }

    subtotal += surgePrice + zonesSurcharge + additionalCharges;

    // Apply discounts
    let discounts = 0;
    if (discountPercentage > 0) {
      discounts += subtotal * (discountPercentage / 100);
    }
    if (discountFixed > 0) {
      discounts += discountFixed;
    }

    if (discounts > 0) {
      breakdown.push({
        description: 'Descuentos',
        amount: -discounts,
      });
    }

    const totalPrice = Math.max(subtotal - discounts, 0);

    return {
      basePrice,
      distancePrice,
      timePrice,
      surgeMultiplier,
      surgePrice,
      zonesSurcharge,
      subtotal,
      discounts,
      totalPrice,
      breakdown,
      appliedRules,
    };
  }

  async getServices() {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return services;
  }

  async getService(serviceId: string) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        pricingRules: {
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!service) {
      throw new Error('Servicio no encontrado');
    }

    return service;
  }

  async estimatePriceRange(serviceId: string, distanceKm: number) {
    const service = await this.getService(serviceId);
    
    // Estimate duration based on average speed
    const averageSpeedKmh = 40;
    const estimatedMinutes = Math.round((distanceKm / averageSpeedKmh) * 60);

    // Calculate min price (no surge, no zones)
    const minPriceCalc = await this.calculatePrice({
      serviceId,
      distanceKm,
      durationMinutes: estimatedMinutes,
      pickupTime: new Date(),
    });

    // Calculate max price (with typical surge)
    const maxPriceCalc = await this.calculatePrice({
      serviceId,
      distanceKm,
      durationMinutes: estimatedMinutes,
      pickupTime: new Date(),
      zoneSurchargePercentage: 20, // Assume 20% zone surcharge
    });

    return {
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
      },
      estimatedMinutes,
      priceRange: {
        min: minPriceCalc.totalPrice,
        max: maxPriceCalc.totalPrice * 1.5, // Add 50% for potential surge
      },
    };
  }
}