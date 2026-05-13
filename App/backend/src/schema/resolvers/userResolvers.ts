import { User } from '../../db/models/User';

export const userResolvers = {
  Query: {
    allUsers: async (): Promise<User[]> => {
      return User.findAll({
        attributes: ['id', 'username', 'isActive'],
      });
    },

    user: async (_: unknown, { username }: { username: string }): Promise<User | null> => {
      return User.findOne({ where: { username } });
    },
  },
};
