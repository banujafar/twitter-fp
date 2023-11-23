import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '../config/appError.ts';
import tryCatch from '../utils/tryCatch.ts';

//check Authentication
const checkAuthMiddleware = tryCatch((req: Request, res: Response, next: NextFunction) => {
  const { auth_token } = req.cookies;
  if (req.isAuthenticated() || auth_token) {
    jwt.verify(auth_token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        throw new AppError(err.message, err.statusCode);
      } else {
        const { userId, username } = decoded;
        console.log(decoded)
        res.status(200).json({ isAuth: true, user: { userId, username } });
      }
    });
  } else {
    throw new AppError('Unauthorized', 401);
  }
});

export default checkAuthMiddleware;
