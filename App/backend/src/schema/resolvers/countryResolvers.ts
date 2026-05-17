import { Country } from '../../db/models/Country';
import { ObjectType, Translations } from '../../models/ObjectType';
import { Op } from 'sequelize';

// Resolvers for country queries
export const countryResolvers = {
  Query: {
    allCountries: async (): Promise<ObjectType[]> => {
      const countries = await Country.findAll();
      return countries.map(
        (c) =>
          new ObjectType(
            c.id,
            c.name,
            c.translations as unknown as Translations,
            c.categories,
            c.imageUrl
          )
      );
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
  },
};
