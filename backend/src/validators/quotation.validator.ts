import { z } from 'zod';

export const createQuotationSchema = z.object({
  body: z.object({
    serviceId: z.string().uuid('ID de servicio inválido'),
    pickupAddress: z.string().min(1, 'Dirección de recogida requerida'),
    pickupLat: z.number().min(-90).max(90, 'Latitud inválida'),
    pickupLng: z.number().min(-180).max(180, 'Longitud inválida'),
    dropoffAddress: z.string().min(1, 'Dirección de destino requerida'),
    dropoffLat: z.number().min(-90).max(90, 'Latitud inválida'),
    dropoffLng: z.number().min(-180).max(180, 'Longitud inválida'),
    requestedDate: z.string().transform((val) => new Date(val)).refine(
      (date) => date > new Date(),
      'La fecha debe ser futura'
    ),
    passengerCount: z.number().int().min(1).max(50, 'Número de pasajeros inválido'),
    specialRequirements: z.string().optional(),
  }),
});

export const quickQuoteSchema = z.object({
  query: z.object({
    serviceId: z.string().uuid('ID de servicio inválido'),
    pickupLat: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val >= -90 && val <= 90,
      'Latitud inválida'
    ),
    pickupLng: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val >= -180 && val <= 180,
      'Longitud inválida'
    ),
    dropoffLat: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val >= -90 && val <= 90,
      'Latitud inválida'
    ),
    dropoffLng: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val >= -180 && val <= 180,
      'Longitud inválida'
    ),
  }),
});

export const getUserQuotationsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => val ? Number(val) : 1),
    limit: z.string().optional().transform((val) => val ? Number(val) : 20),
  }),
});

export const estimatePriceSchema = z.object({
  query: z.object({
    serviceId: z.string().uuid('ID de servicio inválido'),
    distanceKm: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val > 0,
      'Distancia inválida'
    ),
  }),
});

export const getQuotationSchema = z.object({
  params: z.object({
    quotationId: z.string().uuid('ID de cotización inválido'),
  }),
});

export const acceptQuotationSchema = z.object({
  params: z.object({
    quotationId: z.string().uuid('ID de cotización inválido'),
  }),
});