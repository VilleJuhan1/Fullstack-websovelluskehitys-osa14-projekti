import { Score } from '../../db/models/Score';
import { User } from '../../db/models/User';

// Resolvers for score queries and mutations
export const scoreResolvers = {
  Query: {
    topScores: async (
      _: unknown,
      { category, limit }: { category?: string; limit?: number }
    ): Promise<Score[]> => {
      const where = category ? { category } : {};
      return Score.findAll({
        where,
        order: [['highestStreak', 'DESC']],
        limit: limit || 10,
      });
    },
  },
  Mutation: {
    updateStreakScore: async (
      _: unknown,
      { category, streak }: { category: string; streak: number },
      context: { currentUser?: User | null }
    ): Promise<Score> => {
      const user = context.currentUser;
      if (!user) {
        throw new Error('Authentication required');
      }

      const trimmedCategory = category ? category.trim().toLowerCase() : '';
      if (!trimmedCategory) {
        throw new Error('Category is required');
      }

      // Find existing score or create one
      const [scoreRecord] = await Score.findOrCreate({
        where: {
          userId: user.id,
          category: trimmedCategory,
        },
        defaults: {
          userId: user.id,
          category: trimmedCategory,
          highestStreak: streak,
        },
      });

      // If the record was not newly created, we compare and update
      if (streak > scoreRecord.highestStreak) {
        scoreRecord.highestStreak = streak;
        await scoreRecord.save();
      }

      return scoreRecord;
    },
  },
};
