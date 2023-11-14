import { Request, Response, NextFunction } from 'express';

//check Authentication
const checkAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() || req.headers.cookie) {
    res.status(200).json({ isAuth: true });
  } else {
    res.status(401).json({ isAuth: false });
  }
};

export default checkAuthMiddleware;
