import { Kana } from '../../db/models/Kana';
import { ObjectType, Translations } from '../../models/ObjectType';
import { Op } from 'sequelize';

// Resolvers for kana queries
export const kanaResolvers = {
  Query: {
    allKana: async (): Promise<ObjectType[]> => {
      const kana = await Kana.findAll();
      return kana.map(
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

    kana: async (
      _: unknown,
      args: { name: string }
    ): Promise<ObjectType | null> => {
      const foundKana = await Kana.findOne({
        where: {
          name: {
            [Op.iLike]: args.name,
          },
        },
      });
      return foundKana
        ? new ObjectType(
          foundKana.id,
          foundKana.name,
          (foundKana.translations as unknown as Translations) ||
          ({} as Translations),
          foundKana.categories,
          foundKana.imageUrl
        )
        : null;
    },
  },
};
