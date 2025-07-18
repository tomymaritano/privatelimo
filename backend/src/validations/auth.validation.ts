import { body } from 'express-validator';
import { UserRole } from '@prisma/client';

export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('phone')
    .isMobilePhone('any')
    .withMessage('Número de teléfono inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Rol inválido'),
];

export const loginValidation = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Número de teléfono inválido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('El refresh token es requerido'),
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres'),
];

export const requestPasswordResetValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
];