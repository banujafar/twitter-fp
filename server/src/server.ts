import express from 'express';
import { AppDataSource } from './data-source.ts';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a new connection to the database using TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log('connection has established....');
  })
  .catch((err) => {
    console.log('There is an error with connection', err);
  });

app.listen('3000', () => {
  console.log('Server is up on 3000');
});
