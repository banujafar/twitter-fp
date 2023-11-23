import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '../config/appError.ts';
import tryCatch from '../utils/tryCatch.ts';

//check Authentication
const checkAuthMiddleware = tryCatch((req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const { auth_token } = req.cookies;
    jwt.verify(auth_token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        throw new AppError(err.message, err.statusCode);
      } else {
        const { userId, username } = decoded;
        res.status(200).json({ isAuth: true, user: { userId, username } });
      }
    });
  } else {
    throw new AppError('Unauthorized', 401);
  }
});

export default checkAuthMiddleware;
