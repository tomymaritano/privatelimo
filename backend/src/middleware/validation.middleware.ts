import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ERROR_MESSAGES } from '../config/constants';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    const extractedErrors = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : undefined,
      message: err.msg,
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        message: ERROR_MESSAGES.INVALID_INPUT,
        code: 'VALIDATION_ERROR',
        details: extractedErrors,
      },
    });
  };
};