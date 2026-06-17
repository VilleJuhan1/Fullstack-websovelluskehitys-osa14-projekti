import { Umzug, SequelizeStorage } from 'umzug';
import { join } from 'path';
import { sequelize } from './sequelize';

// Import models
import { Country } from './models/Country';
import { Pokemon } from './models/Pokemon';
import { DotaHero } from './models/DotaHero';
import { User } from './models/User';
import { Score } from './models/Score';

// Define associations
User.hasMany(Score, { foreignKey: 'userId', as: 'scores' });
Score.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Country, Pokemon, DotaHero, User, Score, sequelize };

// Sequelize migrator that takes into account production and development builds (js/ts)
export const migrator = new Umzug({
  migrations: {
    glob: __filename.endsWith('.ts')
      ? join(__dirname, '../migrations/*.ts')
      : join(__dirname, '../migrations/*.js'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

/**
 * Authenticates the database connection and runs all pending migrations.
 * This is executed when the backend server starts.
 * 
 * @returns {Promise<void>} Resolves when migrations are complete.
 */
export const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await migrator.up();
    console.log('Migrations up to date.');
  } catch (error) {
    console.error(
      'Unable to connect to the database or run migrations:',
      error
    );
  }
};
