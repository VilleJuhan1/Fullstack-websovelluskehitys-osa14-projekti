import { Country } from "../models/country";
import countries from "../data/countries.json";

export const resolvers = {
  Query: {
    allCountries: (): Country[] => countries,

    country: (_: unknown, args: { name: string }): Country | undefined => {
      return countries.find(
        (c: Country) => c.name.toLowerCase() === args.name.toLowerCase(),
      );
    },
  },
};
