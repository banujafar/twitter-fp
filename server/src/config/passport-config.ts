import jwt from 'jsonwebtoken';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../entity/user.entity.ts';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Request } from 'express';
import AppError from './appError.ts';

//Login user with email or username with using passport local strategy
const passportConfig = (passport: PassportStatic) => {
  passport.use(
    'local-email',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      (email: string, password: string, done) => {
        User.findOneBy({ email })
          .then((user) => {
            if (email && !validator.isEmail(email)) {
              return done({ isOperational: true, statusCode: 400, message: 'Incorrect email' });
            }

            if (!user || !user.isVerified) {
              return done({ isOperational: true, statusCode: 404, message: 'User not found' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                return done(err);
              }
              if (result) {
                return done(null, user);
              } else {
                return done({ isOperational: true, statusCode: 401, message: 'Wrong password' });
              }
            });
          })
          .catch((err) => done(err));
      },
    ),
  );

  passport.use(
    'local-username',
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      (username: string, password: string, done) => {
        User.findOneBy({ username })
          .then((user) => {
            if (!user || !user.isVerified) {
              return done(null, false, { message: 'User not found' });
            }
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                return done(err);
              }
              if (result) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Wrong password' });
              }
            });
          })
          .catch((err) => done(err));
      },
    ),
  );

  //Login with google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true,
      },
      async (request: Request, accessToken: string, refreshToken: string, profile, done) => {
        try {
          const user = await User.findOneBy({ email: profile.email });
          if (!user) {
            return done(null, profile);
          } else {
            throw new AppError(
              'You have a registered address with this email.Please login with just email and password',
              401,
            );
          }
        } catch (error) {
          return request.res.redirect(`${process.env.CLIENT_URL}login?error=${encodeURIComponent(error.message)}`);
        }
      },
    ),
  );

  passport.serializeUser((user: User, done) => {
    const userId = user.id;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    done(null, { token });
  });

  passport.deserializeUser((user: User, done) => {
    const userId = user.id;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    done(null, { token });
  });
};

export default passportConfig;
