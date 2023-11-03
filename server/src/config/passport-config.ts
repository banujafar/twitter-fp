import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../entity/user.entity.ts';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { Callback, FindOptionsWhere } from 'typeorm';
import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Request } from 'express';
const passportConfig = (passport: PassportStatic) => {
  passport.use(
    'local-email',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      (email: string, password: string, done) => {
        User.findOneBy({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: 'User not found' });
            }

            if (email && !validator.isEmail(email)) {
              return done(null, false, { message: 'Incorrect email' });
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

  passport.use(
    'local-username',
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' },
      (username: string, password: string, done) => {
        User.findOneBy({ username })
          .then((user) => {
            if (!user) {
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

  //Login with google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true,
      },
      (request: Request, accessToken:string, refreshToken:string, profile, done:Callback) => {
        done(null,profile)
      },
    ),
  );

  passport.serializeUser((user: User, done) => {
    done(null, user);
  });

  passport.deserializeUser((id: FindOptionsWhere<User>, done) => {
    const user = User.findOneBy(id);
    done(null, user);
  });
};

export default passportConfig;
