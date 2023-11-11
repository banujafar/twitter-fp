import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { User } from '../entity/user.entity.ts';
import validator from 'validator';
import { Token } from '../entity/token.entity.ts';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.ts';
import tryCatch from '../utils/tryCatch.ts';
import AppError from '../config/appError.ts';

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    ['local-email', 'local-username'],
    async (err: { message: string; statusCode: number }, user: User, info: { message: string }) => {
      try {
        if (!user) {
          throw new AppError(err.message, err.statusCode);
        }

        req.logIn(user, async (err) => {
          if (req.body.remember) {
            req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000;
          }
          if (err) {
            throw new AppError(err.message, err.statusCode);
          }
          return res.status(200).json({ message: 'Login Successful' });
        });
      } catch (error) {
        // Handle any errors here
        next(error);
      }
    },
  )(req, res, next);
};

export default loginUser;

const verificationwithLink = async (email: string) => {
  if (!validator.isEmail(email)) {
    throw new AppError('Invalid Email Format', 400);
  }

  const user = await User.findOneBy({ email: email });

  if (!user) {
    throw new AppError('No User Found', 404);
  }

  const token = await Token.findOneBy({ userId: user.id });

  if (token) {
    token.remove();
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);
  const newToken = new Token();
  newToken.userId = user.id;
  newToken.token = hash;
  newToken.createdAt = new Date();

  await newToken.save();
  if (!user.isVerified) {
    const link = `http://localhost:5173/auth/verify?token=${hash}`;
    sendEmail(user.email, 'Verify your email', user.username, link, 'to continue setting up your account');
  } else {
    const link = `http://localhost:5173/reset_password/${user.id}/${resetToken}`;
    sendEmail(user.email, 'Password Reset Request', user.username, link, 'to reset your password');
  }
};

function isExpired(createdAt) {
  const currentTime = new Date().getTime() / 1000;
  const expiredTime = new Date(createdAt).getTime() / 1000 + 300;
  return currentTime > expiredTime;
}
const checkTokenForReset = async ({ id, token }) => {
  const userToken = await Token.findOneBy({ userId: id });

  if (!userToken) {
    throw new AppError('Token not found', 404);
  }

  const isTokenExpired = isExpired(userToken.createdAt);

  if (isTokenExpired) {
    throw new AppError('Token has expired', 401);
  }

  return await new Promise((resolve, reject) => {
    bcrypt.compare(token, userToken.token, (err, result) => {
      if (err) {
        reject(new AppError('Error comparing tokens', 500));
      } else if (result) {
        resolve('Successful password comparison');
      } else {
        reject(new AppError('Token comparison failed', 401));
      }
    });
  });
};

const confirmRequestResetPass = async ({ id, password, confirm_password }) => {
  const user = await User.findOneBy({ id });

  if (!user) {
    throw new AppError('No such User', 404);
  }

  if (password !== confirm_password) {
    throw new AppError('Passwords do not match', 400);
  }

  const hashPass = await bcrypt.hash(password, 10);
  user.password = hashPass;
  await user.save();
};

export { loginUser, verificationwithLink, checkTokenForReset, confirmRequestResetPass };
