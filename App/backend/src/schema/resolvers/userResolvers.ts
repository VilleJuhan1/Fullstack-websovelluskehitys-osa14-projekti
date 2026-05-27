import { User } from '../../db/models/User';

// Resolvers for user queries
export const userResolvers = {
  Query: {
    allUsers: async (): Promise<User[]> => {
      return User.findAll({
        attributes: ['id', 'username', 'isActive'],
      });
    },

    user: async (
      _: unknown,
      { username }: { username: string }
    ): Promise<User | null> => {
      return User.findOne({ where: { username } });
    },

    me: (
      _root: unknown,
      _args: unknown,
      context: { currentUser?: User | null }
    ): User | null => {
      return context.currentUser || null;
    },
  },
  User: {
    scores: async (user: User) => {
      return user.getScores();
    },
  },
};
