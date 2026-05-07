import { ObjectType, Translations } from '../models/ObjectType';
import { Country } from '../db/models/Country';
import { Pokemon } from '../db/models/Pokemon';
import { Op } from 'sequelize';

export const resolvers = {
  Query: {
    allCountries: async (): Promise<ObjectType[]> => {
      const countries = await Country.findAll();
      return countries.map((c) => new ObjectType(c.id, c.name, c.translations as Translations, c.categories, c.imageUrl));
    },

    allPokemon: async (): Promise<ObjectType[]> => {
      const pokemon = await Pokemon.findAll();
      return pokemon.map((p) => new ObjectType(p.id, p.name, (p.translations as Translations) || ({} as Translations), p.categories, p.imageUrl));
    },

    country: async (_: unknown, args: { name: string }): Promise<ObjectType | null> => {
      const country = await Country.findOne({
        where: {
          name: {
            [Op.iLike]: args.name,
          },
        },
      });
      return country ? new ObjectType(country.id, country.name, country.translations as Translations, country.categories, country.imageUrl) : null;
    },

    pokemon: async (_: unknown, args: { name: string }): Promise<ObjectType | null> => {
      const foundPokemon = await Pokemon.findOne({
        where: {
          name: {
            [Op.iLike]: args.name,
          },
        },
      });
      return foundPokemon ? new ObjectType(foundPokemon.id, foundPokemon.name, (foundPokemon.translations as Translations) || ({} as Translations), foundPokemon.categories, foundPokemon.imageUrl) : null;
    },
  },
};
