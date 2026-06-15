import { DotaHero } from '../../db/models/DotaHero';
import { ObjectType, Translations } from '../../models/ObjectType';
import { Op } from 'sequelize';

// Resolvers for dotaHero queries
export const dotaHeroResolvers = {
  Query: {
    allDotaHeroes: async (): Promise<ObjectType[]> => {
      const dotaHero = await DotaHero.findAll();
      return dotaHero.map(
        (d) =>
          new ObjectType(
            d.id,
            d.name,
            (d.translations as unknown as Translations) || ({} as Translations),
            d.categories,
            d.imageUrl
          )
      );
    },

    dotaHero: async (
      _: unknown,
      args: { name: string }
    ): Promise<ObjectType | null> => {
      const foundDotaHero = await DotaHero.findOne({
        where: {
          name: {
            [Op.iLike]: args.name,
          },
        },
      });
      return foundDotaHero
        ? new ObjectType(
          foundDotaHero.id,
          foundDotaHero.name,
          (foundDotaHero.translations as unknown as Translations) ||
          ({} as Translations),
          foundDotaHero.categories,
          foundDotaHero.imageUrl
        )
        : null;
    },
  },
};
