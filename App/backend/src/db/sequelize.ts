import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from the backend root (.env)
dotenv.config({ path: join(__dirname, '../../.env') });

// Checks for the database URL from environment variables and tries to construct it from individual parts if not found (for somewhat legacy reasons)
const DATABASE_URL = process.env.DATABASE_URL ||
  (process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_HOST && process.env.POSTGRES_PORT && process.env.POSTGRES_DB
    ? `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
    : null);

if (!DATABASE_URL) {
  throw new Error('Missing required PostgreSQL connection configuration (DATABASE_URL or individual POSTGRES_* variables)');
}

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});
