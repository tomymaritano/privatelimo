import { body, param, query } from 'express-validator';
import { DocumentType, UserRole } from '@prisma/client';

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('documentType')
    .optional()
    .isIn(Object.values(DocumentType))
    .withMessage('Tipo de documento inválido'),
  body('documentNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Número de documento inválido'),
  body('birthDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de nacimiento inválida'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Dirección demasiado larga'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Ciudad inválida'),
  body('state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Estado/Provincia inválido'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('País inválido'),
  body('zipCode')
    .optional()
    .trim()
    .matches(/^[0-9-]+$/)
    .withMessage('Código postal inválido'),
  body('emergencyContactName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nombre de contacto de emergencia inválido'),
  body('emergencyContactPhone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Teléfono de emergencia inválido'),
];

export const updateDriverProfileValidation = [
  body('licenseNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Número de licencia inválido'),
  body('licenseExpiry')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vencimiento inválida')
    .custom((value) => {
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    })
    .withMessage('La licencia no puede estar vencida'),
  body('bankAccountInfo')
    .optional()
    .isObject()
    .withMessage('Información bancaria inválida'),
];

export const uploadDocumentValidation = [
  body('documentType')
    .notEmpty()
    .isIn(['license', 'profile', 'insurance', 'background'])
    .withMessage('Tipo de documento inválido'),
  body('documentUrl')
    .notEmpty()
    .isURL()
    .withMessage('URL del documento inválida'),
];

export const addFavoriteAddressValidation = [
  body('name')
    .notEmpty()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Nombre de dirección inválido'),
  body('address')
    .notEmpty()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Dirección inválida'),
  body('lat')
    .notEmpty()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  body('lng')
    .notEmpty()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('Valor isDefault inválido'),
];

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
];

export const getUsersValidation = [
  ...paginationValidation,
  query('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Rol inválido'),
  query('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
    .withMessage('Estado inválido'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Búsqueda demasiado larga'),
];

export const userIdParamValidation = [
  param('userId')
    .isUUID()
    .withMessage('ID de usuario inválido'),
];

export const driverIdParamValidation = [
  param('driverId')
    .optional()
    .isUUID()
    .withMessage('ID de conductor inválido'),
];