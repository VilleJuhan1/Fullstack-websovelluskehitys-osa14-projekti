import { DataTypes, QueryInterface } from 'sequelize';
import kanaData from '../data/kana.json';

/**
 * Migration file that initializes the database tables and seeds them with initial data for kana
 * @param queryInterface
 */
export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.createTable('kana', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });

  const formattedKana = kanaData.map((h: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = h; // Remove duplicate id=1
    return {
      ...rest,
      translations: JSON.stringify(rest.translations),
      categories: JSON.stringify(rest.categories),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert('kana', formattedKana);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  await queryInterface.dropTable('kana');
};
