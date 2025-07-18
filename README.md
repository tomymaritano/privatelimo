# 🚗 PrivateLimo - Sistema de Transporte Ejecutivo Premium

Sistema completo de gestión para servicio de transporte ejecutivo con cotizaciones automáticas, reservas en línea y tracking en tiempo real.

## 🚀 Estado del Proyecto

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

### Progreso de Desarrollo

- ✅ **Fase 1: Fundación** (Completado)
  - Base de datos diseñada (20+ tablas)
  - Backend configurado con Express + TypeScript
  - Sistema de autenticación JWT
  - Estructura base del proyecto

- 🚧 **Fase 2: MVP** (En progreso - 25%)
  - ⏳ Sistema de cotizaciones automáticas
  - ⏳ Motor de reservas
  - ⏳ Integración de pagos
  - ⏳ Notificaciones WhatsApp

- 📋 **Fase 3: Real-time** (Pendiente)
  - Tracking en vivo
  - Chat conductor-cliente
  - Notificaciones push

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js con TypeScript
- **ORM:** Prisma
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Validación:** Express Validator
- **Real-time:** Socket.io (próximamente)

### Integraciones
- **Mapas:** Google Maps API
- **Pagos:** Mercado Pago, Stripe
- **Comunicación:** WhatsApp Business API, Twilio
- **Email:** SendGrid/Resend

## 📋 Características Principales

### Implementadas ✅
- Sistema de autenticación completo
- Gestión de usuarios con roles (Cliente, Conductor, Admin)
- Base de datos robusta con 20+ tablas
- API RESTful con validación

### En Desarrollo 🚧
- Cotizaciones automáticas con cálculo inteligente de precios
- Sistema de reservas con estados
- Integración con WhatsApp para notificaciones
- Panel de administración

### Próximamente 📅
- Tracking en tiempo real
- Sistema de pagos online
- Dashboard analytics
- App móvil

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Setup

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/privatelimo.git
cd privatelimo
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar la base de datos**
```bash
# Crear base de datos PostgreSQL
createdb privatelimo

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## 📚 Documentación

- [Documentación de API](./backend/README.md)
- [Esquema de Base de Datos](./docs/database-schema.md)
- [Roadmap de Implementación](./docs/implementation-roadmap.md)
- [Lista de Issues para GitHub](./docs/github-issues-list.md)

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 🚢 Deployment

### Con Docker
```bash
# Build
docker-compose build

# Run
docker-compose up
```

### Manual
```bash
# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Usuario actual

### Próximamente
- Cotizaciones
- Reservas
- Vehículos
- Pagos
- Conductores

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo
- Usar TypeScript strict mode
- Seguir ESLint rules
- Escribir tests para nuevas features
- Documentar funciones complejas

## 📝 License

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Tomás Maritano** - *Desarrollo Inicial* - [GitHub](https://github.com/tomasmaritano)

## 🙏 Agradecimientos

- Next.js team por el framework frontend
- Prisma team por el excelente ORM
- Comunidad open source

## 📞 Contacto

- Email: info@privatelimo.com
- Website: https://privatelimo.com
- Issues: [GitHub Issues](https://github.com/tuusuario/privatelimo/issues)

---

⭐️ Si este proyecto te ayuda, considera darle una estrella!