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
  static success<T>(data?: T, message?: string, statusCode: number = 200): [SuccessResponse<T>, number] {
    return [
      {
        success: true,
        message,
        data
      },
      statusCode
    ];
  }

  static error(message: string, statusCode: number = 500, error?: any): [ErrorResponse, number] {
    return [
      {
        success: false,
        message,
        error
      },
      statusCode
    ];
  }
} 