import express from 'express';
import { AppDataSource } from './data-source.ts';
import bodyParser from 'body-parser';
import userRouter from './routes/user.route.ts';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './entity/session.entity.ts';
import passportConfig from './passportConfig.ts';
import checkAuthMiddleware from './middlewares/checkAuth.ts';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passportConfig(passport);
app.set('trust proxy', 1);

// Initialize a new store using the given options
const sessionRepository = AppDataSource.getRepository(Session);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400,
      httpOnly: true,
      secure: app.get('env') === 'production' ? true : false,
      sameSite: 'lax',
    },
    store: new TypeormStore().connect(sessionRepository),
    secret: 'secret cookie',
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Create a new connection to the database using TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log('connection has established....');
  })
  .catch((err) => {
    console.log(err);
    console.log('There is an error with connection');
  });

app.use('/auth', userRouter);
app.use('/checkAuth',checkAuthMiddleware)
app.listen('3000', () => {
  console.log('Server is up on 3000');
});
