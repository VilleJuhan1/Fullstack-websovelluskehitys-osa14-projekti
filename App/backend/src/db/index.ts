import { Umzug, SequelizeStorage } from 'umzug';
import { join } from 'path';
import { sequelize } from './sequelize';

// Import models
import { Country } from './models/Country';
import { Pokemon } from './models/Pokemon';
import { User } from './models/User';
import { Score } from './models/Score';

// Define associations
User.hasMany(Score, { foreignKey: 'userId', as: 'scores' });
Score.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Country, Pokemon, User, Score, sequelize };

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
