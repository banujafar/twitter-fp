import { Strategy as LocalStrategy } from 'passport-local';
import { User } from './entity/user.entity.ts';
import bcrypt from 'bcrypt';
import validator from 'validator';

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
      User.findOneBy({email})
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
    }),
  );
  passport.use('local-username',
    new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
      User.findOneBy({username})
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
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = User.findOneBy(id);
    done(null, user);
  });
};

export default passportConfig;
