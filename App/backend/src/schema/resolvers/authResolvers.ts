import { User } from '../../db/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Resolvers for authentication mutations
export const authResolvers = {
  Mutation: {
    login: async (
      _: unknown,
      { username, password }: { username: string; password: string }
    ): Promise<{ value: string }> => {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        throw new Error('Invalid username or password');
      }

      const secret = process.env.PASSWORD_SECRET;
      if (!secret) {
        throw new Error('PASSWORD_SECRET is missing from environment');
      }

      const passwordCorrect = await bcrypt.compare(
        password + secret,
        user.hashedPassword
      );

      if (!passwordCorrect) {
        throw new Error('Invalid username or password');
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      };

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is missing from environment');
      }

      return {
        value: jwt.sign(userForToken, jwtSecret),
      };
    },
  },
};
