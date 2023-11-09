import { Request, Response, NextFunction } from 'express';
const errorHandler = (error, req: Request, res: Response, next: NextFunction) => {
  if (error.isOperational) {
    return res.status(error.statusCode).send({
      status: 'error',
      message: error.message,
    });
  } else {
    // Log the error and handle non-operational errors
    console.error(error);
    return res.status(500).send({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
 // return res.status(400).send(error.message)
};
export default errorHandler ;
