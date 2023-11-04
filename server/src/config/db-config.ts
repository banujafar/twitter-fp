import { DataSource } from 'typeorm';
//import 'dotenv/config';
import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config({ path: '.env' });
}
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/entity/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
});
