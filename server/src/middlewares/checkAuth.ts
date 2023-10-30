import { Request, Response, NextFunction } from 'express';
//check Authentication
const checkAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuth: true });
    next();
  } else {
    res.status(401).json({ isAuth: false });
  }
};

export default checkAuthMiddleware;
