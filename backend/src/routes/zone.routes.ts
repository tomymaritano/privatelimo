import { Router } from 'express';
import { ZoneController } from '../controllers/zone.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();
const zoneController = new ZoneController();

// Zone validation schemas
const createZoneSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nombre requerido'),
    slug: z.string().min(1, 'Slug requerido').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
    polygon: z.array(z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })).min(3, 'El polígono debe tener al menos 3 puntos'),
    surchargePercentage: z.number().min(0).max(100).optional(),
    surchargeFixed: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateZoneSchema = z.object({
  params: z.object({
    zoneId: z.string().uuid('ID de zona inválido'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug inválido').optional(),
    polygon: z.array(z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })).min(3).optional(),
    surchargePercentage: z.number().min(0).max(100).optional(),
    surchargeFixed: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

const getZonesSchema = z.object({
  query: z.object({
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
    page: z.string().optional().transform((val) => val ? Number(val) : 1),
    limit: z.string().optional().transform((val) => val ? Number(val) : 20),
  }),
});

const checkPointSchema = z.object({
  query: z.object({
    lat: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val >= -90 && val <= 90,
      'Latitud inválida'
    ),
    lng: z.string().transform(Number).refine(
      (val) => !isNaN(val) && val >= -180 && val <= 180,
      'Longitud inválida'
    ),
  }),
});

// Public routes
router.get(
  '/geojson',
  zoneController.getActiveZonesGeoJSON
);

router.get(
  '/check-point',
  validate(checkPointSchema),
  zoneController.checkPointInZone
);

router.get(
  '/surcharge',
  validate(checkPointSchema),
  zoneController.getZoneSurcharge
);

// Admin routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

router.post(
  '/',
  validate(createZoneSchema),
  zoneController.createZone
);

router.get(
  '/',
  validate(getZonesSchema),
  zoneController.getZones
);

router.get(
  '/:zoneId',
  zoneController.getZone
);

router.put(
  '/:zoneId',
  validate(updateZoneSchema),
  zoneController.updateZone
);

router.delete(
  '/:zoneId',
  zoneController.deleteZone
);

export default router;