import { body, param, query } from 'express-validator';
import { VehicleCategory, VehicleStatus } from '@prisma/client';

export const createVehicleValidation = [
  body('brand')
    .notEmpty()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Marca inválida'),
  body('model')
    .notEmpty()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Modelo inválido'),
  body('year')
    .notEmpty()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Año inválido'),
  body('licensePlate')
    .notEmpty()
    .trim()
    .matches(/^[A-Z0-9-]+$/i)
    .isLength({ min: 6, max: 10 })
    .withMessage('Placa inválida'),
  body('color')
    .notEmpty()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color inválido'),
  body('category')
    .notEmpty()
    .isIn(Object.values(VehicleCategory))
    .withMessage('Categoría inválida'),
  body('capacityPassengers')
    .notEmpty()
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacidad de pasajeros inválida'),
  body('capacityLuggage')
    .notEmpty()
    .isInt({ min: 0, max: 20 })
    .withMessage('Capacidad de equipaje inválida'),
  body('features')
    .optional()
    .isObject()
    .withMessage('Características debe ser un objeto'),
  body('insurancePolicyNumber')
    .notEmpty()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Número de póliza inválido'),
  body('insuranceExpiry')
    .notEmpty()
    .isISO8601()
    .withMessage('Fecha de vencimiento del seguro inválida')
    .custom((value) => {
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    })
    .withMessage('El seguro no puede estar vencido'),
  body('inspectionDate')
    .notEmpty()
    .isISO8601()
    .withMessage('Fecha de inspección inválida'),
  body('inspectionExpiry')
    .notEmpty()
    .isISO8601()
    .withMessage('Fecha de vencimiento de inspección inválida')
    .custom((value) => {
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    })
    .withMessage('La inspección no puede estar vencida'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Imágenes debe ser un array')
    .custom((value) => {
      if (!Array.isArray(value)) return true;
      return value.every((url) => typeof url === 'string' && url.startsWith('http'));
    })
    .withMessage('URLs de imágenes inválidas'),
];

export const updateVehicleValidation = [
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Marca inválida'),
  body('model')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Modelo inválido'),
  body('year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Año inválido'),
  body('licensePlate')
    .optional()
    .trim()
    .matches(/^[A-Z0-9-]+$/i)
    .isLength({ min: 6, max: 10 })
    .withMessage('Placa inválida'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Color inválido'),
  body('category')
    .optional()
    .isIn(Object.values(VehicleCategory))
    .withMessage('Categoría inválida'),
  body('capacityPassengers')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacidad de pasajeros inválida'),
  body('capacityLuggage')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Capacidad de equipaje inválida'),
  body('status')
    .optional()
    .isIn(Object.values(VehicleStatus))
    .withMessage('Estado inválido'),
  body('driverId')
    .optional()
    .custom((value) => value === null || (typeof value === 'string' && value.length > 0))
    .withMessage('ID de conductor inválido'),
  body('features')
    .optional()
    .isObject()
    .withMessage('Características debe ser un objeto'),
  body('insurancePolicyNumber')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Número de póliza inválido'),
  body('insuranceExpiry')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vencimiento del seguro inválida'),
  body('inspectionDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inspección inválida'),
  body('inspectionExpiry')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vencimiento de inspección inválida'),
];

export const vehicleIdParamValidation = [
  param('vehicleId')
    .isUUID()
    .withMessage('ID de vehículo inválido'),
];

export const assignDriverValidation = [
  body('driverId')
    .notEmpty()
    .isUUID()
    .withMessage('ID de conductor inválido'),
];

export const updateVehicleStatusValidation = [
  body('status')
    .notEmpty()
    .isIn(Object.values(VehicleStatus))
    .withMessage('Estado inválido'),
];

export const addVehicleImagesValidation = [
  body('imageUrls')
    .notEmpty()
    .isArray()
    .withMessage('imageUrls debe ser un array')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every((url) => typeof url === 'string' && url.startsWith('http'));
    })
    .withMessage('URLs de imágenes inválidas'),
];

export const getVehiclesValidation = [
  query('category')
    .optional()
    .isIn(Object.values(VehicleCategory))
    .withMessage('Categoría inválida'),
  query('status')
    .optional()
    .isIn(Object.values(VehicleStatus))
    .withMessage('Estado inválido'),
  query('driverId')
    .optional()
    .isUUID()
    .withMessage('ID de conductor inválido'),
  query('minCapacity')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacidad mínima inválida'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
];

export const getAvailableVehiclesValidation = [
  query('pickupTime')
    .notEmpty()
    .isISO8601()
    .withMessage('Hora de recogida inválida')
    .custom((value) => {
      const pickupDate = new Date(value);
      const now = new Date();
      return pickupDate > now;
    })
    .withMessage('La hora de recogida debe ser futura'),
  query('duration')
    .notEmpty()
    .isInt({ min: 30, max: 1440 })
    .withMessage('Duración debe estar entre 30 y 1440 minutos'),
  query('category')
    .optional()
    .isIn(Object.values(VehicleCategory))
    .withMessage('Categoría inválida'),
  query('minCapacity')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Capacidad mínima inválida'),
];

export const driverIdParamValidation = [
  param('driverId')
    .isUUID()
    .withMessage('ID de conductor inválido'),
];