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
  const userToken = await Token.findOneBy({ userId: id }); // Replace 'findOneBy' with your actual query logic
  if (!userToken) {
    throw new Error('Invalid Link');
  }
  bcrypt.compare(token, userToken.token, (err, result) => {
    if (result) {
      return { message: 'matched' };
    } else {
      throw new Error('Link Expired');
    }
  });
};
export { loginUser, forgotPass,checkTokenForReset };
