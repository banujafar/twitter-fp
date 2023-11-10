import bcrypt from 'bcrypt';
import { Router, Request, Response, NextFunction } from 'express';
import { registerUser, markEmailAsVerified } from '../services/user.service.ts';
import { checkTokenForReset, confirmRequestResetPass, forgotPass, loginUser } from '../services/auth.service.ts';
import passport from 'passport';
import sendEmail from '../utils/sendEmail.ts';
import { User } from '../entity/user.entity.ts';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
    try {
      const verificationLink = `http://localhost:5173/auth/verify?token=${token}`;

      const emailSentResult = await sendEmail(email, 'Email Verification', username, verificationLink);

      if (emailSentResult.message === 'email sent successfully') {

        return res.status(201).json({
          user: req.body,
          message: 'Check your email for verification instructions.',
        });
      } else {
        return res.status(500).json({ message: 'Failed to send verification email' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }),
);

userRouter.get('/verify/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: 'Invalid or missing verification token' });
    }
    const { email } = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

    const user = await User.findOne({
      where: { email, token },
    });

    if (user) {
      if (user.isVerified) {
        return res.status(200).json({ message: 'Email already verified. You can now log in.' });
      }

      const verificationResult = markEmailAsVerified(token);

      if (verificationResult) {
        user.isVerified = true;
        user.token = null;
        await user.save();
        const authToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
          expiresIn: '1h',
        });

        return res.status(200).json({ message: 'Email verified. You can now log in.', token: `Bearer ${authToken}` });
      } else {
        return res.status(500).json({ message: 'Failed to verify email' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//Login router
userRouter.post('/login', loginUser);
//Forgot password
userRouter.post(
  '/forgotpass',
  tryCatch(async (req: Request, res: Response, next) => {
    const { email } = req.body;
    
    await forgotPass(email).then(() => res.status(200).json({ message: 'Email sent successfully' }));
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
