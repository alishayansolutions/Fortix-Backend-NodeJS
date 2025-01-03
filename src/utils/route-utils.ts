import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from './response-utils';
import { MESSAGES } from '../constants/messages';
import * as yup from 'yup';

type ControllerFunction = (req: AuthRequest, res: Response) => Promise<any>;

export const routeHandler = (controller: ControllerFunction) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      console.log("Controller Error: ", error);
      
      if (error instanceof yup.ValidationError) {
        const [errorResponse, status] = ResponseUtils.badRequest(
          MESSAGES.ERROR.VALIDATION_ERROR,
          error.errors
        );
        return res.status(status).json(errorResponse);
      }
      
      if (error.statusCode) {
        const [errorResponse, status] = ResponseUtils.error(
          error.message,
          error.statusCode
        );
        res.status(status).json(errorResponse);
      } else if (error.name === 'ValidationError') {
        const [errorResponse, status] = ResponseUtils.badRequest(
          MESSAGES.ERROR.VALIDATION_ERROR,
          error.errors
        );
        res.status(status).json(errorResponse);
      } else if (error.code === '23505') {
        const [errorResponse, status] = ResponseUtils.conflict(
          MESSAGES.ERROR.RESOURCE_EXISTS
        );
        res.status(status).json(errorResponse);
      } else {
        const [errorResponse, status] = ResponseUtils.serverError(
          MESSAGES.ERROR.SERVER_ERROR,
          error?.message
        );
        res.status(status).json(errorResponse);
      }
    }
  };
}; 