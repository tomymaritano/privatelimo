export const constants = {
  // JWT
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // Bcrypt
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  
  // Booking
  BOOKING_CODE_LENGTH: 6,
  QUOTATION_EXPIRY_MINUTES: 30,
  DRIVER_ARRIVAL_RADIUS_METERS: 100,
  MAX_SCHEDULE_DAYS_ADVANCE: 30,
  
  // Pricing
  BASE_COMMISSION_RATE: 0.20,
  SURGE_PRICE_THRESHOLD: 1.5,
  NIGHT_HOURS_START: 22,
  NIGHT_HOURS_END: 6,
  NIGHT_SURCHARGE_MULTIPLIER: 1.2,
  
  // Notifications
  SMS_RATE_LIMIT: 10, // per hour
  EMAIL_RATE_LIMIT: 20, // per hour
  
  // Maps
  DEFAULT_SEARCH_RADIUS_KM: 10,
  MAX_SEARCH_RADIUS_KM: 50,
  
  // Ratings
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_DRIVER_RATING_FOR_PREMIUM: 4.5,
  
  // Timeouts
  DRIVER_RESPONSE_TIMEOUT_SECONDS: 30,
  PAYMENT_TIMEOUT_MINUTES: 10,
  
  // Cache TTL (seconds)
  CACHE_TTL: {
    PRICING_RULES: 3600, // 1 hour
    VEHICLE_AVAILABILITY: 300, // 5 minutes
    DRIVER_LOCATION: 10, // 10 seconds
    ZONES: 86400, // 24 hours
  },
};

export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_ALREADY_EXISTS: 'El usuario ya existe',
  UNAUTHORIZED: 'No autorizado',
  TOKEN_EXPIRED: 'Token expirado',
  TOKEN_INVALID: 'Token inválido',
  
  // Validation
  INVALID_INPUT: 'Datos de entrada inválidos',
  MISSING_REQUIRED_FIELDS: 'Faltan campos requeridos',
  
  // Booking
  NO_DRIVERS_AVAILABLE: 'No hay conductores disponibles en este momento',
  BOOKING_NOT_FOUND: 'Reserva no encontrada',
  BOOKING_ALREADY_CANCELLED: 'La reserva ya fue cancelada',
  BOOKING_CANNOT_BE_CANCELLED: 'La reserva no puede ser cancelada',
  INVALID_PICKUP_TIME: 'La hora de recogida debe ser futura',
  
  // Payment
  PAYMENT_FAILED: 'El pago falló',
  INSUFFICIENT_FUNDS: 'Fondos insuficientes',
  PAYMENT_METHOD_NOT_FOUND: 'Método de pago no encontrado',
  
  // Driver
  DRIVER_NOT_APPROVED: 'El conductor no está aprobado',
  DRIVER_NOT_AVAILABLE: 'El conductor no está disponible',
  
  // Vehicle
  VEHICLE_NOT_AVAILABLE: 'El vehículo no está disponible',
  VEHICLE_CAPACITY_EXCEEDED: 'La capacidad del vehículo fue excedida',
  
  // General
  INTERNAL_SERVER_ERROR: 'Error interno del servidor',
  RESOURCE_NOT_FOUND: 'Recurso no encontrado',
  OPERATION_FAILED: 'La operación falló',
};

export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  REGISTER_SUCCESS: 'Registro exitoso',
  PASSWORD_RESET_SUCCESS: 'Contraseña restablecida exitosamente',
  
  // Booking
  BOOKING_CREATED: 'Reserva creada exitosamente',
  BOOKING_CANCELLED: 'Reserva cancelada exitosamente',
  BOOKING_COMPLETED: 'Viaje completado exitosamente',
  
  // Payment
  PAYMENT_SUCCESS: 'Pago procesado exitosamente',
  REFUND_SUCCESS: 'Reembolso procesado exitosamente',
  
  // Profile
  PROFILE_UPDATED: 'Perfil actualizado exitosamente',
  
  // General
  OPERATION_SUCCESS: 'Operación exitosa',
  DATA_RETRIEVED: 'Datos obtenidos exitosamente',
};