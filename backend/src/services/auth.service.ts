import { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateTokens } from '../utils/jwt.utils';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants';

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    const { email, phone, password, firstName, lastName, role } = data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });
    
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          phone,
          passwordHash,
          role,
          status: UserStatus.ACTIVE,
        },
      });
      
      await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          documentType: 'DNI', // Default, should be provided by user
          documentNumber: '', // Should be provided by user
        },
      });
      
      // If registering as driver, create driver record
      if (role === UserRole.DRIVER) {
        await tx.driver.create({
          data: {
            userId: newUser.id,
            licenseNumber: '', // To be updated later
            licenseExpiry: new Date(), // To be updated later
            backgroundCheckStatus: 'PENDING',
            status: 'OFFLINE',
          },
        });
      }
      
      return newUser;
    });
    
    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      tokens,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
    };
  }
  
  async login(data: LoginData) {
    const { email, phone, password } = data;
    
    if (!email && !phone) {
      throw new Error('Email o teléfono es requerido');
    }
    
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ].filter(condition => Object.keys(condition).length > 0),
        status: UserStatus.ACTIVE,
      },
      include: {
        profile: true,
      },
    });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    
    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
      },
      tokens,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    };
  }
  
  async refreshToken(refreshToken: string) {
    // This would verify the refresh token and generate new tokens
    // Implementation depends on your refresh token strategy
    throw new Error('Not implemented');
  }
  
  async logout(userId: string) {
    // Implement any cleanup needed (e.g., invalidate refresh tokens)
    return {
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };
  }
  
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);
    
    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
    
    return {
      message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  }
  
  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Don't reveal if user exists or not
      return {
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
      };
    }
    
    // TODO: Implement password reset logic
    // 1. Generate reset token
    // 2. Save token with expiry
    // 3. Send email with reset link
    
    return {
      message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña',
    };
  }
}