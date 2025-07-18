import { User, Profile, Driver, DocumentType, UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';
import { hashPassword } from '../utils/password.utils';

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  birthDate?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

interface UpdateDriverData {
  licenseNumber?: string;
  licenseExpiry?: Date;
  licenseImageUrl?: string;
  bankAccountInfo?: any;
}

interface AddressData {
  name: string;
  address: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        driver: true,
      },
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Remove sensitive data
    const { passwordHash, ...userData } = user;
    return userData;
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
        documentType: data.documentType || 'DNI',
        documentNumber: data.documentNumber || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
      },
    });

    return {
      profile,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
    };
  }

  async updateDriverProfile(userId: string, data: UpdateDriverData) {
    // Verify user is a driver
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.DRIVER) {
      throw new Error('Usuario no es conductor');
    }

    const driver = await prisma.driver.update({
      where: { userId },
      data,
    });

    return {
      driver,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
    };
  }

  async uploadDocument(userId: string, documentType: string, documentUrl: string) {
    // This would handle document uploads for verification
    // In a real implementation, you'd validate the document type
    // and store it securely, possibly with a third-party service
    
    let updateData: any = {};
    
    if (documentType === 'license') {
      updateData = { licenseImageUrl: documentUrl };
    } else if (documentType === 'profile') {
      return await prisma.profile.update({
        where: { userId },
        data: { profileImageUrl: documentUrl },
      });
    }

    if (Object.keys(updateData).length > 0) {
      return await prisma.driver.update({
        where: { userId },
        data: updateData,
      });
    }

    throw new Error('Tipo de documento inválido');
  }

  async getBookingHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId },
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
          vehicle: true,
          service: true,
          reviews: {
            where: { reviewerId: userId },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where: { userId } }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFavoriteAddresses(userId: string) {
    // In a real implementation, you'd have a separate table for addresses
    // For now, we'll return mock data
    return [
      {
        id: '1',
        name: 'Casa',
        address: '123 Main St, Miami, FL',
        lat: 25.7617,
        lng: -80.1918,
        isDefault: true,
      },
      {
        id: '2',
        name: 'Trabajo',
        address: '456 Business Ave, Miami, FL',
        lat: 25.7751,
        lng: -80.1947,
        isDefault: false,
      },
    ];
  }

  async addFavoriteAddress(userId: string, data: AddressData) {
    // In a real implementation, save to database
    return {
      id: Date.now().toString(),
      userId,
      ...data,
      message: 'Dirección guardada exitosamente',
    };
  }

  async updatePassword(userId: string, newPassword: string) {
    const passwordHash = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  }

  async deleteAccount(userId: string) {
    // Soft delete
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'INACTIVE',
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Cuenta eliminada exitosamente',
    };
  }

  async getDriverStats(driverId: string) {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        bookings: {
          where: {
            status: 'COMPLETED',
          },
        },
        earnings: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        },
      },
    });

    if (!driver) {
      throw new Error('Conductor no encontrado');
    }

    const totalEarnings = driver.earnings.reduce(
      (sum, earning) => sum + earning.finalAmount.toNumber(),
      0
    );

    return {
      totalTrips: driver.totalTrips,
      rating: driver.rating,
      monthlyEarnings: totalEarnings,
      completedTripsThisMonth: driver.bookings.length,
    };
  }

  async getAllUsers(filters: any, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        {
          profile: {
            OR: [
              { firstName: { contains: filters.search, mode: 'insensitive' } },
              { lastName: { contains: filters.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: true,
          driver: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Remove sensitive data
    const sanitizedUsers = users.map(({ passwordHash, ...user }) => user);

    return {
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}