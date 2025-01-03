import { STATUS_CODES } from '../constants/status-codes';

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export class ResponseUtils {
  static success<T>(
    data?: T, 
    message?: string, 
    statusCode: number = STATUS_CODES.OK
  ): [SuccessResponse<T>, number] {
    return [
      {
        success: true,
        message,
        data
      },
      statusCode
    ];
  }

  static error(
    message: string, 
    statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR, 
    error?: any
  ): [ErrorResponse, number] {
    return [
      {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { error })
      },
      statusCode
    ];
  }

  // Helper methods for common responses
  static created<T>(data?: T, message?: string): [SuccessResponse<T>, number] {
    return this.success(data, message, STATUS_CODES.CREATED);
  }

  static badRequest(message: string, error?: any): [ErrorResponse, number] {
    return this.error(message, STATUS_CODES.BAD_REQUEST, error);
  }

  static unauthorized(message: string, error?: any): [ErrorResponse, number] {
    return this.error(message, STATUS_CODES.UNAUTHORIZED, error);
  }

  static forbidden(message: string, error?: any): [ErrorResponse, number] {
    return this.error(message, STATUS_CODES.FORBIDDEN, error);
  }

  static notFound(message: string, error?: any): [ErrorResponse, number] {
    return this.error(message, STATUS_CODES.NOT_FOUND, error);
  }

  static conflict(message: string, error?: any): [ErrorResponse, number] {
    return this.error(message, STATUS_CODES.CONFLICT, error);
  }

  static serverError(message: string, error?: any): [ErrorResponse, number] {
    return this.error(message, STATUS_CODES.INTERNAL_SERVER_ERROR, error);
  }
} 