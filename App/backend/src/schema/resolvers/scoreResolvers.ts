import { Score } from '../../db/models/Score';

export const scoreResolvers = {
  Query: {
    topScores: async (
      _: unknown,
      { category, limit }: { category?: string; limit?: number }
    ): Promise<Score[]> => {
      const where = category ? { category } : {};
      return Score.findAll({
        where,
        order: [['totalRight', 'DESC']],
        limit: limit || 10,
      });
    },
  },
};
