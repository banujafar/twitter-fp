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

const loginUser = tryCatch(async (req: Request, res: Response, next: NextFunction) => {
  await passport.authenticate(
    ['local-email', 'local-username'],
    (err: object, user: User, info: { message: string }) => {
      if (!user) {
        throw new AppError('Incorrect credentials', 400);
      }

      req.logIn(user, async (err) => {
        if (req.body.remember) {
          req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000;
        }
        if (err) {
          next(err);
          throw new AppError('Login failed', 500);
        }
        return res.status(200).json({ message: 'Login Successful' });
      });
    },
  )(req, res, next);
});

const forgotPass = async (email: string) => {
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

  const link = `http://localhost:5173/reset_password/${user.id}/${resetToken}`;

  sendEmail(user.email, 'Password Reset Request', user.username, link);
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

export { loginUser, forgotPass, checkTokenForReset, confirmRequestResetPass };
