import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize';

/**
 * The Kana (Japanese script) category table in the database.
 * Used as a quiz category.
 */
export class Kana extends Model {
  declare id: number;
  declare name: string;
  declare translations: Record<string, string> | null;
  declare categories: string[];
  declare imageUrl: string;
}

Kana.init(
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: false,
    timestamps: true,
    modelName: 'kana',
    tableName: 'kana', // matches the table name in the migration
  }
);
