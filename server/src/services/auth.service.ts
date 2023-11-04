import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { User } from '../entity/user.entity.ts';
import validator from 'validator';
import { Token } from '../entity/token.entity.ts';
import crypto from 'crypto';
import sendEmail from '../utils/send-email.ts';

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(['local-email', 'local-username'], (err: object, user: User, info: { message: string }) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({ message: info?.message || 'Incorrect credentials.' });
    }

    req.logIn(user, (err) => {
      if (req.body.remember) {
        req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000;
      }
      if (err) {
        return next(err);
      }

      return res.status(200).json({ message: 'Login Successful' });
    });
  })(req, res, next);
};

const forgotPass = async (email: string) => {
  //send email with reset link to user
  if (!validator.isEmail(email)) {
    throw new Error('Invalid Email Format');
  }
  const user = await User.findOneBy({ email: email });
  if (!user) {
    throw new Error('No User Found');
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

const checkTokenForReset = async ({ id, token }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userToken = await Token.findOneBy({ userId: id });

      if (!userToken) {
        resolve({ message: 'Invalid Link' });
      } else {
        const isTokenExpired = isExpired(userToken.createdAt); // Define a function to check expiration
        console.log(isTokenExpired);

        if (isTokenExpired) {
          resolve(false);
        } else {
          bcrypt.compare(token, userToken.token, (err, result) => {
            if (result) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const confirmRequestResetPass = async ({ id, password, confirm_password }) => {
  const user = await User.findOneBy({ id });
  console.log(user);
  if (!user) {
    throw new Error('No such User');
  }
  if (password !== confirm_password) {
    throw new Error('Passwords do not match');
  }
  const hashPass = await bcrypt.hash(password, 10);
  user.password = hashPass;
  await user.save();
};
// Function to check if a token is expired
function isExpired(createdAt) {
  const currentTime = new Date().getTime() / 1000;
  const expiredTime = new Date(createdAt).getTime() / 1000 + 300;
  return currentTime > expiredTime;
}

export { loginUser, forgotPass, checkTokenForReset, confirmRequestResetPass };
