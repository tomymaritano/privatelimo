import { PrismaClient, Role, VehicleType, VehicleStatus, RuleType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@privatelimo.com' },
    update: {},
    create: {
      email: 'admin@privatelimo.com',
      phone: '+5491100000000',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'PrivateLimo',
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  console.log('✓ Usuario admin creado');

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'sedan-ejecutivo' },
      update: {},
      create: {
        name: 'Sedán Ejecutivo',
        slug: 'sedan-ejecutivo',
        description: 'Toyota Corolla o similar. Ideal para viajes ejecutivos.',
        basePrice: 2500,
        pricePerKm: 150,
        pricePerMinute: 50,
        minimumDistanceKm: 2,
        minimumDurationMinutes: 10,
        maxPassengers: 4,
        maxLuggage: 3,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'suv-premium' },
      update: {},
      create: {
        name: 'SUV Premium',
        slug: 'suv-premium',
        description: 'Toyota RAV4 o similar. Más espacio y comodidad.',
        basePrice: 3500,
        pricePerKm: 200,
        pricePerMinute: 70,
        minimumDistanceKm: 2,
        minimumDurationMinutes: 10,
        maxPassengers: 6,
        maxLuggage: 4,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'van-ejecutiva' },
      update: {},
      create: {
        name: 'Van Ejecutiva',
        slug: 'van-ejecutiva',
        description: 'Mercedes Sprinter o similar. Para grupos grandes.',
        basePrice: 5000,
        pricePerKm: 250,
        pricePerMinute: 100,
        minimumDistanceKm: 2,
        minimumDurationMinutes: 10,
        maxPassengers: 12,
        maxLuggage: 10,
        isActive: true,
      },
    }),
  ]);

  console.log('✓ Servicios creados');

  // Create pricing rules
  const pricingRules = await Promise.all([
    // Surge pricing for rush hours
    prisma.pricingRule.create({
      data: {
        serviceId: services[0].id,
        name: 'Hora pico matutina',
        ruleType: RuleType.SURGE,
        conditions: {
          timeRanges: [{ start: 7, end: 9 }],
          dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        },
        multiplier: 1.3,
        priority: 10,
        isActive: true,
      },
    }),
    prisma.pricingRule.create({
      data: {
        serviceId: services[0].id,
        name: 'Hora pico vespertina',
        ruleType: RuleType.SURGE,
        conditions: {
          timeRanges: [{ start: 17, end: 20 }],
          dayOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        },
        multiplier: 1.3,
        priority: 10,
        isActive: true,
      },
    }),
    // Night surcharge
    prisma.pricingRule.create({
      data: {
        serviceId: services[0].id,
        name: 'Recargo nocturno',
        ruleType: RuleType.TIME_BASED,
        conditions: {
          timeRanges: [{ start: 22, end: 24 }, { start: 0, end: 6 }],
        },
        fixedAmount: 500,
        priority: 5,
        isActive: true,
      },
    }),
  ]);

  console.log('✓ Reglas de precios creadas');

  // Create zones
  const zones = await Promise.all([
    prisma.zone.create({
      data: {
        name: 'Aeropuerto Ezeiza',
        slug: 'aeropuerto-ezeiza',
        polygon: [
          { lat: -34.8222, lng: -58.5358 },
          { lat: -34.8222, lng: -58.5158 },
          { lat: -34.8022, lng: -58.5158 },
          { lat: -34.8022, lng: -58.5358 },
        ],
        surchargePercentage: 15,
        surchargeFixed: 800,
        isActive: true,
      },
    }),
    prisma.zone.create({
      data: {
        name: 'Puerto Madero',
        slug: 'puerto-madero',
        polygon: [
          { lat: -34.6037, lng: -58.3638 },
          { lat: -34.6037, lng: -58.3538 },
          { lat: -34.6237, lng: -58.3538 },
          { lat: -34.6237, lng: -58.3638 },
        ],
        surchargePercentage: 10,
        isActive: true,
      },
    }),
  ]);

  console.log('✓ Zonas creadas');

  // Create test driver
  const driverPassword = await bcrypt.hash('driver123', 10);
  const driver = await prisma.user.upsert({
    where: { email: 'driver@privatelimo.com' },
    update: {},
    create: {
      email: 'driver@privatelimo.com',
      phone: '+5491100000001',
      password: driverPassword,
      firstName: 'Juan',
      lastName: 'Conductor',
      role: Role.DRIVER,
      isVerified: true,
      driver: {
        create: {
          licenseNumber: 'B1234567',
          licenseExpiry: new Date('2025-12-31'),
          rating: 4.8,
          totalTrips: 150,
          isAvailable: true,
          isApproved: true,
        },
      },
    },
  });

  console.log('✓ Conductor de prueba creado');

  // Create test vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      driverId: driver.driver!.id,
      serviceId: services[0].id,
      licensePlate: 'AB123CD',
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      color: 'Negro',
      vehicleType: VehicleType.SEDAN,
      capacity: 4,
      status: VehicleStatus.ACTIVE,
      insuranceNumber: 'INS123456',
      insuranceExpiry: new Date('2025-06-30'),
      lastMaintenanceDate: new Date('2024-01-15'),
    },
  });

  console.log('✓ Vehículo de prueba creado');

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      phone: '+5491100000002',
      password: customerPassword,
      firstName: 'María',
      lastName: 'Cliente',
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });

  console.log('✓ Cliente de prueba creado');

  console.log('\n✅ Seed completado exitosamente!');
  console.log('\nUsuarios de prueba:');
  console.log('- Admin: admin@privatelimo.com / admin123');
  console.log('- Driver: driver@privatelimo.com / driver123');
  console.log('- Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });