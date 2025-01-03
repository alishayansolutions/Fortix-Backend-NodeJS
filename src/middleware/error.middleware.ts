import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response-utils';
import { MESSAGES } from '../constants/messages';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    const [errorResponse, status] = ResponseUtils.badRequest(
      MESSAGES.ERROR.INVALID_JSON,
      'Invalid JSON format in request body'
    );
    return res.status(status).json(errorResponse);
  }

  // Handle other errors
  const [errorResponse, status] = ResponseUtils.serverError(
    MESSAGES.ERROR.SERVER_ERROR,
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );
  res.status(status).json(errorResponse);
}; 