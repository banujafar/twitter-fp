//AppError for catching errors
class AppError extends Error {
  errorCode: number;
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export default AppError;
