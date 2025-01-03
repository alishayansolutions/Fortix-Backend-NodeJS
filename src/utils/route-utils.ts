import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from './response-utils';

type ControllerFunction = (req: AuthRequest, res: Response) => Promise<any>;

export const routeHandler = (controller: ControllerFunction) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      // Handle specific error types
      if (error.status) {
        // Custom error with status
        res.status(error.status).json(ResponseUtils.error(error.message));
      } else if (error.name === 'ValidationError') {
        // Validation errors
        res.status(400).json(ResponseUtils.error(error.message));
      } else if (error.code === '23505') {
        // PostgreSQL unique violation
        res.status(409).json(ResponseUtils.error('Resource already exists'));
      } else {
        // Default error handler
        console.error('Unhandled error:', error);
        res.status(500).json(ResponseUtils.error(
          'Something went wrong!',
          process.env.NODE_ENV === 'development' ? error : undefined
        ));
      }
    }
  };
};

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    public message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'APIError';
  }
} 