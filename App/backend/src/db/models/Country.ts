import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

export class Country extends Model {
  declare id: number;
  declare name: string;
  declare translations: Record<string, string> | null;
  declare categories: string[];
  declare imageUrl: string;
}

Country.init(
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
    modelName: 'country',
  }
);
