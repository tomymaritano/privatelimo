import { Zone } from '@prisma/client';
import { prisma } from '../config/database';
import { MapsService, LocationCoordinates } from './maps.service';

interface CreateZoneData {
  name: string;
  slug: string;
  polygon: LocationCoordinates[];
  surchargePercentage?: number;
  surchargeFixed?: number;
  isActive?: boolean;
}

interface UpdateZoneData extends Partial<CreateZoneData> {}

interface ZoneFilters {
  isActive?: boolean;
  search?: string;
}

export class ZoneService {
  private mapsService: MapsService;

  constructor() {
    this.mapsService = new MapsService();
  }

  async createZone(data: CreateZoneData) {
    // Check if slug already exists
    const existingZone = await prisma.zone.findUnique({
      where: { slug: data.slug },
    });

    if (existingZone) {
      throw new Error('Ya existe una zona con este identificador');
    }

    // Validate polygon (minimum 3 points)
    if (!data.polygon || data.polygon.length < 3) {
      throw new Error('El polígono debe tener al menos 3 puntos');
    }

    const zone = await prisma.zone.create({
      data: {
        name: data.name,
        slug: data.slug,
        polygon: data.polygon,
        surchargePercentage: data.surchargePercentage,
        surchargeFixed: data.surchargeFixed,
        isActive: data.isActive ?? true,
      },
    });

    return zone;
  }

  async updateZone(zoneId: string, data: UpdateZoneData) {
    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });

    if (!zone) {
      throw new Error('Zona no encontrada');
    }

    // If updating slug, check uniqueness
    if (data.slug && data.slug !== zone.slug) {
      const existingZone = await prisma.zone.findUnique({
        where: { slug: data.slug },
      });

      if (existingZone) {
        throw new Error('Ya existe una zona con este identificador');
      }
    }

    // Validate polygon if provided
    if (data.polygon && data.polygon.length < 3) {
      throw new Error('El polígono debe tener al menos 3 puntos');
    }

    const updatedZone = await prisma.zone.update({
      where: { id: zoneId },
      data,
    });

    return updatedZone;
  }

  async getZone(zoneId: string) {
    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });

    if (!zone) {
      throw new Error('Zona no encontrada');
    }

    return zone;
  }

  async getZones(filters: ZoneFilters, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [zones, total] = await Promise.all([
      prisma.zone.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.zone.count({ where }),
    ]);

    return {
      zones,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteZone(zoneId: string) {
    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
    });

    if (!zone) {
      throw new Error('Zona no encontrada');
    }

    // Soft delete by deactivating
    const deletedZone = await prisma.zone.update({
      where: { id: zoneId },
      data: {
        isActive: false,
      },
    });

    return {
      message: 'Zona eliminada exitosamente',
      zone: deletedZone,
    };
  }

  async checkPointInZone(coordinates: LocationCoordinates): Promise<Zone | null> {
    // Get all active zones
    const activeZones = await prisma.zone.findMany({
      where: { isActive: true },
    });

    // Check each zone
    for (const zone of activeZones) {
      const polygon = zone.polygon as LocationCoordinates[];
      if (this.mapsService.isPointInPolygon(coordinates, polygon)) {
        return zone;
      }
    }

    return null;
  }

  async getZoneSurcharge(coordinates: LocationCoordinates): Promise<{
    zone: Zone | null;
    surchargePercentage: number;
    surchargeFixed: number;
  }> {
    const zone = await this.checkPointInZone(coordinates);

    if (!zone) {
      return {
        zone: null,
        surchargePercentage: 0,
        surchargeFixed: 0,
      };
    }

    return {
      zone,
      surchargePercentage: zone.surchargePercentage?.toNumber() || 0,
      surchargeFixed: zone.surchargeFixed?.toNumber() || 0,
    };
  }

  async getMultipleZoneSurcharges(
    pickupCoordinates: LocationCoordinates,
    dropoffCoordinates: LocationCoordinates
  ): Promise<{
    pickupZone: Zone | null;
    dropoffZone: Zone | null;
    totalSurchargePercentage: number;
    totalSurchargeFixed: number;
  }> {
    const [pickupSurcharge, dropoffSurcharge] = await Promise.all([
      this.getZoneSurcharge(pickupCoordinates),
      this.getZoneSurcharge(dropoffCoordinates),
    ]);

    // Combine surcharges (you can adjust the logic as needed)
    const totalSurchargePercentage = Math.max(
      pickupSurcharge.surchargePercentage,
      dropoffSurcharge.surchargePercentage
    );
    
    const totalSurchargeFixed = 
      pickupSurcharge.surchargeFixed + dropoffSurcharge.surchargeFixed;

    return {
      pickupZone: pickupSurcharge.zone,
      dropoffZone: dropoffSurcharge.zone,
      totalSurchargePercentage,
      totalSurchargeFixed,
    };
  }

  async getActiveZonesGeoJSON() {
    const zones = await prisma.zone.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        polygon: true,
        surchargePercentage: true,
        surchargeFixed: true,
      },
    });

    // Convert to GeoJSON format
    const features = zones.map(zone => ({
      type: 'Feature',
      properties: {
        id: zone.id,
        name: zone.name,
        surchargePercentage: zone.surchargePercentage,
        surchargeFixed: zone.surchargeFixed,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          (zone.polygon as LocationCoordinates[]).map(point => [point.lng, point.lat])
        ],
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}