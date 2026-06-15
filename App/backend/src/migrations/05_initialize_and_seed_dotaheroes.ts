import { DataTypes, QueryInterface } from 'sequelize';
import dotaHeroesData from '../data/dotaHeroes.json';

// Migration file that initializes the database tables and seeds them with initial data for dotaHeroes
export const up = async ({
    context: queryInterface,
}: {
    context: QueryInterface;
}) => {
    // Create Dota Heroes Table
    await queryInterface.createTable('dotaHeroes', {
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

    const formattedDotaHeroes = dotaHeroesData.map((h: Record<string, unknown>) => {
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
    await queryInterface.bulkInsert('dotaHeroes', formattedDotaHeroes);
};

export const down = async ({
    context: queryInterface,
}: {
    context: QueryInterface;
}) => {
    await queryInterface.dropTable('dotaHeroes');
};