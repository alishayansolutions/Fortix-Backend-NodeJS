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
  static success<T>(data?: T, message?: string): SuccessResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message: string, error?: any): ErrorResponse {
    return {
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { error })
    };
  }
} 