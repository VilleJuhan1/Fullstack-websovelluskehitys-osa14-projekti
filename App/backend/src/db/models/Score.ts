import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class Score extends Model {
  declare id: number;
  declare userId: number;
  declare category: string;
  declare totalRounds: number;
  declare totalRight: number;
  declare totalWrong: number;
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
    totalRounds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalRight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalWrong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
