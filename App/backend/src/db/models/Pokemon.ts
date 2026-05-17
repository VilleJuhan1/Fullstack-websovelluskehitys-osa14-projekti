import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class Pokemon extends Model {
  declare id: number;
  declare name: string;
  declare translations: Record<string, string> | null;
  declare categories: string[];
  declare imageUrl: string;
}

// Pokemon table that can be used as a quiz category
Pokemon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translations: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    categories: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: true,
    modelName: 'pokemon',
    tableName: 'pokemon', // ensure pluralization doesn't mess it up
  }
);
