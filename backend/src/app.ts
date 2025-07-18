import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle.routes';
import quotationRoutes from './routes/quotation.routes';
import zoneRoutes from './routes/zone.routes';
// import bookingRoutes from './routes/booking.routes';
// import paymentRoutes from './routes/payment.routes';
// import driverRoutes from './routes/driver.routes';
// import adminRoutes from './routes/admin.routes';

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL!, process.env.ADMIN_URL!]
    : '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.',
});

app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/zones', zoneRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/drivers', driverRoutes);
// app.use('/api/admin', adminRoutes);

// API documentation endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'PrivateLimo API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      bookings: '/api/bookings',
      vehicles: '/api/vehicles',
      payments: '/api/payments',
      drivers: '/api/drivers',
      quotations: '/api/quotations',
      admin: '/api/admin',
    },
    documentation: '/api/docs',
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;