import { Vehicle, VehicleCategory, VehicleStatus, UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { ERROR_MESSAGES } from '../config/constants';

interface CreateVehicleData {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  category: VehicleCategory;
  capacityPassengers: number;
  capacityLuggage: number;
  features?: any;
  insurancePolicyNumber: string;
  insuranceExpiry: Date;
  inspectionDate: Date;
  inspectionExpiry: Date;
  images?: string[];
}

interface UpdateVehicleData extends Partial<CreateVehicleData> {
  status?: VehicleStatus;
  driverId?: string | null;
}

interface VehicleFilters {
  category?: VehicleCategory;
  status?: VehicleStatus;
  driverId?: string;
  minCapacity?: number;
}

export class VehicleService {
  async createVehicle(data: CreateVehicleData) {
    // Check if license plate already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate: data.licensePlate },
    });

    if (existingVehicle) {
      throw new Error('Ya existe un vehículo con esta placa');
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        images: data.images || [],
        features: data.features || {},
      },
      include: {
        driver: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return vehicle;
  }

  async updateVehicle(vehicleId: string, data: UpdateVehicleData) {
    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // If updating license plate, check uniqueness
    if (data.licensePlate && data.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { licensePlate: data.licensePlate },
      });

      if (existingVehicle) {
        throw new Error('Ya existe un vehículo con esta placa');
      }
    }

    // If assigning to driver, check if driver exists and is available
    if (data.driverId !== undefined) {
      if (data.driverId) {
        const driver = await prisma.driver.findUnique({
          where: { id: data.driverId },
        });

        if (!driver) {
          throw new Error('Conductor no encontrado');
        }
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data,
      include: {
        driver: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return updatedVehicle;
  }

  async getVehicle(vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        driver: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        bookings: {
          where: {
            scheduledPickupTime: {
              gte: new Date(),
            },
            status: {
              notIn: ['CANCELLED', 'COMPLETED'],
            },
          },
          orderBy: {
            scheduledPickupTime: 'asc',
          },
          take: 5,
        },
      },
    });

    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    return vehicle;
  }

  async getVehicles(filters: VehicleFilters, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.driverId) {
      where.driverId = filters.driverId;
    }

    if (filters.minCapacity) {
      where.capacityPassengers = {
        gte: filters.minCapacity,
      };
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          driver: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    return {
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteVehicle(vehicleId: string) {
    // Check if vehicle has active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        vehicleId,
        status: {
          notIn: ['CANCELLED', 'COMPLETED'],
        },
      },
    });

    if (activeBookings > 0) {
      throw new Error('No se puede eliminar un vehículo con reservas activas');
    }

    // Soft delete by setting status to INACTIVE
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        status: VehicleStatus.INACTIVE,
        driverId: null,
      },
    });

    return {
      message: 'Vehículo eliminado exitosamente',
      vehicle,
    };
  }

  async assignDriver(vehicleId: string, driverId: string) {
    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: true,
      },
    });

    if (!driver) {
      throw new Error('Conductor no encontrado');
    }

    // Check if driver is approved
    if (driver.backgroundCheckStatus !== 'APPROVED') {
      throw new Error('El conductor no está aprobado');
    }

    // Assign vehicle to driver
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        driverId,
      },
      include: {
        driver: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return updatedVehicle;
  }

  async unassignDriver(vehicleId: string) {
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        driverId: null,
      },
    });

    return {
      message: 'Conductor desasignado exitosamente',
      vehicle,
    };
  }

  async getAvailableVehicles(
    pickupTime: Date,
    duration: number,
    category?: VehicleCategory,
    minCapacity?: number
  ) {
    const endTime = new Date(pickupTime.getTime() + duration * 60000);

    // Get vehicles that don't have bookings in the requested time
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: VehicleStatus.ACTIVE,
        ...(category && { category }),
        ...(minCapacity && { capacityPassengers: { gte: minCapacity } }),
        driverId: { not: null },
        driver: {
          status: 'AVAILABLE',
          backgroundCheckStatus: 'APPROVED',
        },
        NOT: {
          bookings: {
            some: {
              AND: [
                {
                  status: {
                    notIn: ['CANCELLED'],
                  },
                },
                {
                  OR: [
                    {
                      // Booking starts during requested time
                      scheduledPickupTime: {
                        gte: pickupTime,
                        lt: endTime,
                      },
                    },
                    {
                      // Booking ends during requested time
                      estimatedArrivalTime: {
                        gt: pickupTime,
                        lte: endTime,
                      },
                    },
                    {
                      // Booking encompasses requested time
                      AND: [
                        {
                          scheduledPickupTime: {
                            lte: pickupTime,
                          },
                        },
                        {
                          estimatedArrivalTime: {
                            gte: endTime,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
      include: {
        driver: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return vehicles;
  }

  async updateVehicleStatus(vehicleId: string, status: VehicleStatus) {
    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status },
    });

    return vehicle;
  }

  async addVehicleImages(vehicleId: string, imageUrls: string[]) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    const currentImages = (vehicle.images as string[]) || [];
    const updatedImages = [...currentImages, ...imageUrls];

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        images: updatedImages,
      },
    });

    return updatedVehicle;
  }

  async getDriverVehicles(driverId: string, userId: string, userRole: UserRole) {
    // Verify the driver is requesting their own vehicles or is an admin
    if (userRole !== UserRole.ADMIN) {
      const driver = await prisma.driver.findUnique({
        where: { id: driverId },
      });

      if (!driver || driver.userId !== userId) {
        throw new Error('No autorizado para ver estos vehículos');
      }
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        driverId,
      },
      include: {
        bookings: {
          where: {
            scheduledPickupTime: {
              gte: new Date(),
            },
            status: {
              notIn: ['CANCELLED', 'COMPLETED'],
            },
          },
          orderBy: {
            scheduledPickupTime: 'asc',
          },
        },
      },
    });

    return vehicles;
  }
}