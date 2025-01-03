import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { ResponseUtils } from '../utils/response-utils';
import { MESSAGES } from '../constants/messages';

export const validate = (schema: yup.ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      }, { 
        abortEarly: false,
        stripUnknown: true
      });
      
      return next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.map(err => err.message);

        const [errorResponse, status] = ResponseUtils.badRequest(
          MESSAGES.ERROR.VALIDATION_ERROR,
          errors
        );
        return res.status(status).json(errorResponse);
      }
      next(error);
    }
  };
}; 