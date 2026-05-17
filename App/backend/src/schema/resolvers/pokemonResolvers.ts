import { Pokemon } from '../../db/models/Pokemon';
import { ObjectType, Translations } from '../../models/ObjectType';
import { Op } from 'sequelize';

// Resolvers for pokemon queries
export const pokemonResolvers = {
  Query: {
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
};
