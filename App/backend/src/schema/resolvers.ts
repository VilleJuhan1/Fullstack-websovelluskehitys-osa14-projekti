import { ObjectType, Translations } from '../models/ObjectType';
import { Country } from '../db/models/Country';
import { Pokemon } from '../db/models/Pokemon';
import { User } from '../db/models/User';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const resolvers = {
  Query: {
    allCountries: async (): Promise<ObjectType[]> => {
      const countries = await Country.findAll();
      return countries.map(
        (c) =>
          new ObjectType(
            c.id,
            c.name,
            c.translations as unknown as Translations, // We're unsure which languages are available, so we cast to unknown first
            c.categories,
            c.imageUrl
          )
      );
    },

    allPokemon: async (): Promise<ObjectType[]> => {
      const pokemon = await Pokemon.findAll();
      return pokemon.map(
        (p) =>
          new ObjectType(
            p.id,
            p.name,
            (p.translations as unknown as Translations) || ({} as Translations),
            p.categories,
            p.imageUrl
          )
      );
    },

    // Return all users, but only username and isActive status
    allUsers: async (): Promise<User[]> => {
      return User.findAll({
        attributes: ['id', 'username', 'isActive'],
      });
    },

    country: async (
      _: unknown,
      args: { name: string }
    ): Promise<ObjectType | null> => {
      const country = await Country.findOne({
        where: {
          name: {
            [Op.iLike]: args.name,
          },
        },
      });
      return country
        ? new ObjectType(
            country.id,
            country.name,
            country.translations as unknown as Translations,
            country.categories,
            country.imageUrl
          )
        : null;
    },

    pokemon: async (
      _: unknown,
      args: { name: string }
    ): Promise<ObjectType | null> => {
      const foundPokemon = await Pokemon.findOne({
        where: {
          name: {
            [Op.iLike]: args.name,
          },
        },
      });
      return foundPokemon
        ? new ObjectType(
            foundPokemon.id,
            foundPokemon.name,
            (foundPokemon.translations as unknown as Translations) ||
              ({} as Translations),
            foundPokemon.categories,
            foundPokemon.imageUrl
          )
        : null;
    },
  },

  Mutation: {
    login: async (
      _: unknown,
      { username, password }: { username: string; password: string }
    ): Promise<{ value: string }> => {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Uses the same PASSWORD_SECRET as the migration
      const secret = process.env.PASSWORD_SECRET;
      if (!secret) {
        throw new Error('PASSWORD_SECRET is missing from environment');
      }

      const passwordCorrect = await bcrypt.compare(
        password + secret,
        user.hashedPassword
      );

      if (!passwordCorrect) {
        throw new Error('Invalid username or password');
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      };

      // For the webtoken
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is missing from environment');
      }

      return {
        value: jwt.sign(userForToken, jwtSecret),
      };
    },
  },
};
