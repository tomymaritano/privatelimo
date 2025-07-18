import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { validatePasswordStrength } from '../utils/password.utils';
import { UserRole } from '@prisma/client';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, password, firstName, lastName, role = UserRole.CLIENT } = req.body;
      
      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Contraseña débil',
            code: 'WEAK_PASSWORD',
            details: passwordValidation.errors,
          },
        });
      }
      
      const result = await authService.register({
        email,
        phone,
        password,
        firstName,
        lastName,
        role,
      });
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, password } = req.body;
      
      const result = await authService.login({
        email,
        phone,
        password,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      
      const result = await authService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      const result = await authService.logout(userId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      
      // Validate new password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Contraseña débil',
            code: 'WEAK_PASSWORD',
            details: passwordValidation.errors,
          },
        });
      }
      
      const result = await authService.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      
      const result = await authService.requestPasswordReset(email);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}