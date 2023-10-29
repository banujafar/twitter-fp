import express from 'express';
import { AppDataSource } from './data-source.ts';
import bodyParser from 'body-parser';
import { User } from './entity/user.entity.ts';
import userRouter from './routes/user.route.ts';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a new connection to the database using TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log('connection has established....');
  })
  .catch((err) => {
    console.log(err);
    console.log('There is an error with connection');
  });

//TODO:WILL BE REMOVED
app.post('/', async (req, res) => {
  const newUser = await AppDataSource.getRepository(User).create(req.body);
  const result = await AppDataSource.getRepository(User).save(newUser);
  console.log('new user created -- ', result);
  res.status(200).json('New user has been created!');
});
app.get('/', async (req, res) => {
  const users = await AppDataSource.getRepository(User).find();
  console.log(users);
  res.setHeader('content-type', 'application/json').json(users);
});

app.use('/auth', userRouter);

app.listen('3000', () => {
  console.log('Server is up on 3000');
});
