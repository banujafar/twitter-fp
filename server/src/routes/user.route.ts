import { Router, Request, Response, NextFunction } from 'express';
import { registerUser } from '../services/user.service.ts';
import {
  checkTokenForReset,
  confirmRequestResetPass,
  verificationwithLink,
  loginUser
} from '../services/auth.service.ts';
import passport from 'passport';
import { User } from '../entity/user.entity.ts';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';
import { Token } from '../entity/token.entity.ts';

const userRouter = Router();
//Register router
userRouter.post(
  '/register',
  tryCatch(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    await registerUser(username, email, password).then(async () => {
      await verificationwithLink(email)
        .then(() => {
          return res.status(201).json({
            user: req.body,
            message: 'Check your email for verification instructions.',
          });
        })
        .catch(() => {
          return res.status(500).json({ message: 'Failed to send verification email' });
        });
    });
  }),
);

userRouter.get(
  '/verify',
  tryCatch(async (req: Request, res: Response) => {
    const token = String(req.query.token);

    if (!token) {
      return res.status(400).json({ message: 'Invalid or missing verification token' });
    }

    const userToken = await Token.findOneBy({ token });

    if (!userToken) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const user = await User.findOne({
      where: { id: userToken.userId },
    });

    if (user) {
      if (user.isVerified) {
        return res.status(200).json({ message: 'Email already verified. You can now log in.' });
      }
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: 'Email verified. You can now log in.' });
    } else {
      return res.status(500).json({ message: 'Failed to verify email' });
    }
  }),
);

//Login router
userRouter.post('/login', loginUser);
//Forgot password
userRouter.post(
  '/forgotpass',
  tryCatch(async (req: Request, res: Response, next) => {
    const { email } = req.body;
    await verificationwithLink(email).then(() => res.status(200).json({ message: 'Email sent successfully' }));
  }),
);

userRouter.get(
  '/reset_password/:id/:token',
  tryCatch(async (req, res) => {
    const { token } = req.params; // Use req.params to get URL parameters
    const id = +req.params.id;

    await checkTokenForReset({ id, token }).then(() => {
      res.status(200).json('Password reset page has been retrieved successfully');
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

userRouter.get('/google',  (req, res, next) => {
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}login`,
  })(req, res, next);
})

userRouter.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      successRedirect: process.env.CLIENT_URL,
      failureRedirect: `${process.env.CLIENT_URL}login`,
    })(req, res, next);
  }
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
