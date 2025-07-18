import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createVehicleValidation,
  updateVehicleValidation,
  vehicleIdParamValidation,
  assignDriverValidation,
  updateVehicleStatusValidation,
  addVehicleImagesValidation,
  getVehiclesValidation,
  getAvailableVehiclesValidation,
  driverIdParamValidation,
} from '../validations/vehicle.validation';
import { UserRole } from '@prisma/client';

const router = Router();
const vehicleController = new VehicleController();

// Public route to get available vehicles (for quotations)
router.get(
  '/available',
  validate(getAvailableVehiclesValidation),
  vehicleController.getAvailableVehicles
);

// All other routes require authentication
router.use(authenticate);

// Get all vehicles (with filters)
router.get(
  '/',
  validate(getVehiclesValidation),
  vehicleController.getVehicles
);

// Get single vehicle
router.get(
  '/:vehicleId',
  validate(vehicleIdParamValidation),
  vehicleController.getVehicle
);

// Admin only routes
router.post(
  '/',
  authorize(UserRole.ADMIN),
  validate(createVehicleValidation),
  vehicleController.createVehicle
);

router.put(
  '/:vehicleId',
  authorize(UserRole.ADMIN),
  validate([...vehicleIdParamValidation, ...updateVehicleValidation]),
  vehicleController.updateVehicle
);

router.delete(
  '/:vehicleId',
  authorize(UserRole.ADMIN),
  validate(vehicleIdParamValidation),
  vehicleController.deleteVehicle
);

router.post(
  '/:vehicleId/assign-driver',
  authorize(UserRole.ADMIN),
  validate([...vehicleIdParamValidation, ...assignDriverValidation]),
  vehicleController.assignDriver
);

router.post(
  '/:vehicleId/unassign-driver',
  authorize(UserRole.ADMIN),
  validate(vehicleIdParamValidation),
  vehicleController.unassignDriver
);

router.put(
  '/:vehicleId/status',
  authorize(UserRole.ADMIN),
  validate([...vehicleIdParamValidation, ...updateVehicleStatusValidation]),
  vehicleController.updateVehicleStatus
);

router.post(
  '/:vehicleId/images',
  authorize(UserRole.ADMIN),
  validate([...vehicleIdParamValidation, ...addVehicleImagesValidation]),
  vehicleController.addVehicleImages
);

// Driver routes
router.get(
  '/driver/:driverId',
  authorize(UserRole.DRIVER, UserRole.ADMIN),
  validate(driverIdParamValidation),
  vehicleController.getDriverVehicles
);

export default router;