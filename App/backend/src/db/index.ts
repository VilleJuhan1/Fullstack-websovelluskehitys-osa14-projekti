import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load from the backend root (App/backend/.env)
dotenv.config({ path: join(__dirname, '../../.env') });

const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_HOST = process.env.POSTGRES_HOST
const POSTGRES_PORT = process.env.POSTGRES_PORT

if (!POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB || !POSTGRES_HOST || !POSTGRES_PORT) {
  throw new Error('Missing required PostgreSQL environment variables');
}

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  //dialectOptions: {
  //  ssl: {
  //    require: true,
  //    rejectUnauthorized: false,
  //  },
  //},
});

export const migrator = new Umzug({
  migrations: {
    glob: 'src/migrations/*.ts',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await migrator.up();
    console.log('Migrations up to date.');
  } catch (error) {
    console.error('Unable to connect to the database or run migrations:', error);
  }
};
