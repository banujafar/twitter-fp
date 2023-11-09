import bcrypt from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import registerUser from '../services/user.service.ts';
import { checkTokenForReset, confirmRequestResetPass, forgotPass, loginUser } from '../services/auth.service.ts';
import passport from 'passport';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';

const userRouter = Router();
//Register router
userRouter.post(
  '/register',
  tryCatch(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const token = await registerUser(username, email, password);

    if (typeof token !== 'string') {
      throw new AppError(token.error, 400);
    }

    res.status(201).json({ message: 'Registration successful', token: `Bearer ${token}` });
  }),
);

//Login router
userRouter.post('/login', loginUser);
//Forgot password
userRouter.post(
  '/forgotpass',
  tryCatch((req: Request, res: Response, next) => {
    const { email } = req.body;
    const result = forgotPass(email);
    if (result) {
      return res.status(200).json({ message: 'Email sent successfully' });
    } else {
      return res.status(400).send({ message: 'No account found' });
    }
  }),
);

userRouter.get(
  '/reset_password/:id/:token',
  tryCatch(async (req, res) => {
    const { token } = req.params; // Use req.params to get URL parameters
    const id = +req.params.id;

    await checkTokenForReset({ id, token }).then(() => {
      res.status(200).json('Password reset successful');
    });
  }),
);

userRouter.post(
  '/reset_password/:id/:token',
  tryCatch(async (req, res) => {
    const { password, confirm_password } = req.body;
    const id = +req.params.id;

    await confirmRequestResetPass({ id, password, confirm_password }).then(() => {
      res.status(200).json('Password changed');
    });
  }),
);

userRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login',
  }),
);

userRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login',
  }),
);

userRouter.post(
  '/logout',
  tryCatch((req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
      if (err) {
        throw new AppError('Logout failed', 500);
      }

      res.clearCookie('connect.sid');
      req.session.destroy(function (err) {
        if (err) {
          throw new AppError('Session destruction failed', 500);
        }
        res.status(200).json('Logout successfully');
      });
    });
  }),
);

export default userRouter;
