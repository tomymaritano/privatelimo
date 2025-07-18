# PrivateLimo Backend API

Backend API para el sistema de transporte ejecutivo PrivateLimo.

## Stack Tecnológico

- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
cd backend
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Configurar la base de datos:
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Cargar datos de prueba
npm run prisma:seed
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el TypeScript
- `npm run start` - Inicia el servidor en producción
- `npm run prisma:generate` - Genera el cliente Prisma
- `npm run prisma:migrate` - Ejecuta las migraciones
- `npm run prisma:studio` - Abre Prisma Studio
- `npm run prisma:seed` - Carga datos de prueba

## Endpoints de API

### Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "phone": "+1234567890",
  "password": "Password123!",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "CLIENT" // CLIENT, DRIVER, ADMIN
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "phone": "+1234567890",
      "role": "CLIENT"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    },
    "message": "Registro exitoso"
  }
}
```

#### POST `/api/auth/login`
Inicia sesión con email o teléfono.

**Body:**
```json
{
  "email": "usuario@ejemplo.com", // o "phone": "+1234567890"
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "phone": "+1234567890",
      "role": "CLIENT",
      "profile": {
        "firstName": "Juan",
        "lastName": "Pérez"
      }
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    },
    "message": "Inicio de sesión exitoso"
  }
}
```

#### POST `/api/auth/logout`
Cierra la sesión del usuario actual.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Sesión cerrada exitosamente"
  }
}
```

#### POST `/api/auth/change-password`
Cambia la contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Body:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

#### POST `/api/auth/request-password-reset`
Solicita un restablecimiento de contraseña.

**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

#### GET `/api/auth/me`
Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer {accessToken}
```

## Validación de Contraseñas

Las contraseñas deben cumplir con:
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial

## Roles de Usuario

- **CLIENT** - Cliente regular
- **DRIVER** - Conductor
- **ADMIN** - Administrador del sistema

## Códigos de Error

- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `500` - Internal Server Error

## Estructura de Respuesta

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Mensaje de error",
    "code": "ERROR_CODE",
    "details": [ ... ] // Opcional
  }
}
```

## APIs Implementadas

### Usuarios (`/api/users`)
- Gestión de perfiles de usuario
- Funcionalidades específicas para conductores
- Historial de viajes
- Direcciones favoritas

### Vehículos (`/api/vehicles`)
- CRUD completo de vehículos
- Asignación de conductores
- Verificación de disponibilidad
- Gestión de flota

### Cotizaciones (`/api/quotations`)
- Cálculo automático de precios
- Tarifas dinámicas (surge pricing)
- Integración con zonas y recargos
- Cotizaciones rápidas sin autenticación
- Formato WhatsApp para compartir

### Zonas (`/api/zones`)
- Gestión de zonas con polígonos GeoJSON
- Recargos por zona (porcentaje y fijo)
- Detección automática de zona
- API pública para consultas

Ver documentación detallada en:
- [API de Cotizaciones](./docs/quotation-api.md)

## Próximas Implementaciones

- [ ] Sistema de Reservas
- [ ] Integración de Pagos (MercadoPago, Stripe)
- [ ] Sistema de Notificaciones (WhatsApp Business API)
- [ ] Tracking en Tiempo Real
- [ ] Dashboard y Reportes
- [ ] Sistema de Promociones
- [ ] Calificaciones y Reseñas
- [ ] Cuentas Corporativas

## Datos de Prueba

El seed incluye:
- Admin: admin@privatelimo.com / admin123
- Driver: driver@privatelimo.com / driver123
- Customer: customer@example.com / customer123
- 3 tipos de servicio (Sedán, SUV, Van)
- 2 zonas con recargos (Aeropuerto Ezeiza, Puerto Madero)
- Reglas de precios dinámicos