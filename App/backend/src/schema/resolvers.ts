import { ObjectType, Translations } from '../models/ObjectType';
import countries from '../data/countries.json';
import pokemon from '../data/pokemon.json';

export const resolvers = {
  Query: {
    allCountries: (): ObjectType[] => countries.map((c) => new ObjectType(c.id, c.name, c.translations as Translations, c.categories, c.imageUrl)),
    allPokemon: (): ObjectType[] => pokemon.map((p) => new ObjectType(p.id, p.name, {} as Translations, p.categories, p.imageUrl)),

    country: (_: unknown, args: { name: string }): ObjectType | undefined => {
      const country = countries.find(
        (c) => c.name.toLowerCase() === args.name.toLowerCase()
      );
      return country ? new ObjectType(country.id, country.name, country.translations as Translations, country.categories, country.imageUrl) : undefined;
    },

    pokemon: (_: unknown, args: { name: string }): ObjectType | undefined => {
      const foundPokemon = pokemon.find(
        (p) => p.name.toLowerCase() === args.name.toLowerCase()
      );
      return foundPokemon ? new ObjectType(foundPokemon.id, foundPokemon.name, {} as Translations, foundPokemon.categories, foundPokemon.imageUrl) : undefined;
    },
  },
};
