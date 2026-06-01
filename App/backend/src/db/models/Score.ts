import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

// Stores the scores for each category for each user
export class Score extends Model {
  declare id: number;
  declare userId: number;
  declare category: string;
  declare highestStreak: number;
}

Score.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    highestStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: true,
    modelName: 'score',
  }
);
