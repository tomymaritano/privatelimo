import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  updateProfileValidation,
  updateDriverProfileValidation,
  uploadDocumentValidation,
  addFavoriteAddressValidation,
  paginationValidation,
  getUsersValidation,
  userIdParamValidation,
  driverIdParamValidation,
} from '../validations/user.validation';
import { UserRole } from '@prisma/client';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// User profile routes
router.get('/profile', userController.getProfile);
router.put(
  '/profile',
  validate(updateProfileValidation),
  userController.updateProfile
);

// Driver specific routes
router.put(
  '/driver/profile',
  authorize(UserRole.DRIVER),
  validate(updateDriverProfileValidation),
  userController.updateDriverProfile
);

router.get(
  '/driver/stats',
  authorize(UserRole.DRIVER),
  userController.getDriverStats
);

router.get(
  '/driver/:driverId/stats',
  authorize(UserRole.ADMIN),
  validate(driverIdParamValidation),
  userController.getDriverStats
);

// Document upload
router.post(
  '/documents',
  validate(uploadDocumentValidation),
  userController.uploadDocument
);

// Booking history
router.get(
  '/bookings',
  validate(paginationValidation),
  userController.getBookingHistory
);

// Favorite addresses
router.get('/addresses', userController.getFavoriteAddresses);
router.post(
  '/addresses',
  validate(addFavoriteAddressValidation),
  userController.addFavoriteAddress
);

// Account management
router.delete('/account', userController.deleteAccount);

// Admin routes
router.get(
  '/',
  authorize(UserRole.ADMIN),
  validate(getUsersValidation),
  userController.getAllUsers
);

router.get(
  '/:userId',
  authorize(UserRole.ADMIN),
  validate(userIdParamValidation),
  userController.getUserById
);

export default router;