import express from 'express';
import { AppDataSource } from './config/db-config.ts';
import bodyParser from 'body-parser';
import userRouter from './routes/user.route.ts';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './entity/session.entity.ts';
import passportConfig from './config/passport-config.ts';
import checkAuthMiddleware from './middlewares/checkAuth.ts';
import errorHandler from './middlewares/errorHandler.ts';
import postRouter from './routes/post.route.ts';
import http from 'http';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import socketService from './config/socketService.ts';
import chatRouter from './routes/chat.route.ts';

const app = express();
const allowedOrigins = ['https://twitter-client-ckmh.onrender.com', 'http://localhost:5173'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
passportConfig(passport);
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server,{
 cors:{
  origin:[...allowedOrigins],
 }
});

// Initialize a new store using the given options
const sessionRepository = AppDataSource.getRepository(Session);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000 || 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: app.get('env') === 'production' ? true : false,
      sameSite: 'none',
      //sameSite: 'lax',
    },
    store: new TypeormStore().connect(sessionRepository),
    secret: 'secret cookie',
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, '../../../client/src/assets/uploads');
socketService(io);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/posts', express.static(uploadDir));

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
app.use('/checkAuth', checkAuthMiddleware);
app.use('/api/posts', postRouter);
app.use('/api/chats', chatRouter);

app.use(errorHandler);

server.listen('3000', () => {
  console.log('Server is up on 3000');
});
