import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../index';

export class User extends Model {
    declare id: number;
    declare username: string;
    declare hashedPassword: string;
    declare email: string;
    declare isAdmin: boolean;
    declare isPremiumUser: boolean;
    declare isActive: boolean;
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