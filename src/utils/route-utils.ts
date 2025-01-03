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
      if (error.statusCode) {
        // Error with status code
        const [errorResponse, status] = ResponseUtils.error(error.message, error.statusCode);
        res.status(status).json(errorResponse);
      } else if (error.name === 'ValidationError') {
        // Validation errors
        const [errorResponse, status] = ResponseUtils.error(error.message, 400);
        res.status(status).json(errorResponse);
      } else if (error.code === '23505') {
        // PostgreSQL unique violation
        const [errorResponse, status] = ResponseUtils.error('Resource already exists', 409);
        res.status(status).json(errorResponse);
      } else {
        // Default error handler
        console.error('Unhandled error:', error);
        const [errorResponse, status] = ResponseUtils.error(
          'Something went wrong!',
          500,
          process.env.NODE_ENV === 'development' ? error : undefined
        );
        res.status(status).json(errorResponse);
      }
    }
  };
}; 