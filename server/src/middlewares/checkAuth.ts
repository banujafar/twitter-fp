import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '../config/appError.ts';
import tryCatch from '../utils/tryCatch.ts';

// Check Authentication
const checkAuthMiddleware = tryCatch((req, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    console.log(user)
    const userId = user.id;
    const username = user.username;

    const { auth_token } = req.cookies;

    if (!auth_token) {
      // If auth_token doesn't exist, create a new token and set it in the response cookies
      const newToken = jwt.sign({ userId, username }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      res.cookie('auth_token', newToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 3600000),
      });
    }

    // Verify the existing or newly created token
    jwt.verify(auth_token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        throw new AppError(err.message, err.statusCode);
      } else {
        const userId = decoded.id;
        const username = decoded.username;
        res.status(200).json({ isAuth: true, user: { userId, username } });
      }
    });
  } else {
    throw new AppError('Unauthorized', 401);
  }
});

export default checkAuthMiddleware;
