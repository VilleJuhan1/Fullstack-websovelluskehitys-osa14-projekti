import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from '../sequelize';
import { Score } from './Score';

/**
 * The User table in the database.
 * Stores the user data.
 */
export class User extends Model {
  declare id: number;
  declare username: string;
  declare hashedPassword: string;
  declare email: string;
  declare isAdmin: boolean;
  declare isPremiumUser: boolean;
  declare isActive: boolean;

  // User can have multiple scores, one for each main quiz category
  declare getScores: HasManyGetAssociationsMixin<Score>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isPremiumUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: true,
    modelName: 'user',
  }
);
