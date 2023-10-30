import { Router, Request, Response, NextFunction } from 'express';
import registerUser from '../services/user.service.ts';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../entity/user.entity.ts';
const userRouter = Router();

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const token = await registerUser(username, email, password);

    if (typeof token !== 'string') {
      return res.status(400).json({ message: token.error });
    }

    return res.status(201).json({ message: 'Registration successful', token: `Bearer ${token}` });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.post('/login', (req:Request, res:Response, next:NextFunction) => {
  if (req.body.remember) {
    req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000;
  }

  passport.authenticate(['local', 'local-username'], (err: object, user: User, info: { message: string; }) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info?.message || 'Incorrect credentials.' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ userId: req.session['passport'].user.id }, process.env.SECRET_KEY, {
        expiresIn: '10h',
      });
      res.cookie('token', token, { httpOnly: true, secure: true });
      return res.status(200).json({ message: 'Login Successful' });
    });
  })(req, res, next);
});
export default userRouter;
