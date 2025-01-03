import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ResponseUtils } from './response-utils';
import { MESSAGES } from '../constants/messages';

type ControllerFunction = (req: AuthRequest, res: Response) => Promise<any>;

export const routeHandler = (controller: ControllerFunction) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      console.log("Controller Error: ", error);
      if (error.statusCode) {
        const [errorResponse, status] = ResponseUtils.error(error.message, error.statusCode);
        res.status(status).json(errorResponse);
      } else if (error.name === 'ValidationError') {
        const [errorResponse, status] = ResponseUtils.error(MESSAGES.ERROR.VALIDATION_ERROR, 400);
        res.status(status).json(errorResponse);
      } else if (error.code === '23505') {
        const [errorResponse, status] = ResponseUtils.error(MESSAGES.ERROR.RESOURCE_EXISTS, 409);
        res.status(status).json(errorResponse);
      } else {
        const [errorResponse, status] = ResponseUtils.error(
          MESSAGES.ERROR.SERVER_ERROR,
          500,
          error?.message
        );
        res.status(status).json(errorResponse);
      }
    }
  };
}; 