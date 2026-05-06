import { DataTypes } from 'sequelize';
import countriesData from '../data/countries.json';
import pokemonData from '../data/pokemon.json';

export const up = async ({ context: queryInterface }: any) => {
  // Create Countries Table
  await queryInterface.createTable('countries', {
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

  // Create Pokemon Table
  await queryInterface.createTable('pokemon', {
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

  // Seed Countries table with initial data
  const formattedCountries = countriesData.map((c: any) => {
    const { id, ...rest } = c; // Remove duplicate id=1
    return {
      ...rest,
      translations: JSON.stringify(rest.translations),
      categories: JSON.stringify(rest.categories),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert('countries', formattedCountries);

  // Seed Pokemon table with initial data
  const formattedPokemon = pokemonData.map((p: any) => {
    const { id, ...rest } = p;
    return {
      ...rest,
      categories: JSON.stringify(rest.categories),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert('pokemon', formattedPokemon);
};

export const down = async ({ context: queryInterface }: any) => {
  await queryInterface.dropTable('countries');
  await queryInterface.dropTable('pokemon');
};
