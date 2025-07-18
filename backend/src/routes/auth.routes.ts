import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  changePasswordValidation,
  requestPasswordResetValidation,
} from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/register',
  validate(registerValidation),
  authController.register
);

router.post(
  '/login',
  validate(loginValidation),
  authController.login
);

router.post(
  '/refresh-token',
  validate(refreshTokenValidation),
  authController.refreshToken
);

router.post(
  '/request-password-reset',
  validate(requestPasswordResetValidation),
  authController.requestPasswordReset
);

// Protected routes
router.post(
  '/logout',
  authenticate,
  authController.logout
);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordValidation),
  authController.changePassword
);

router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

export default router;