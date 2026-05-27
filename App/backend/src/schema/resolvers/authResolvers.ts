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

    createUser: async (
      _: unknown,
      {
        username,
        password,
        email,
      }: { username: string; password: string; email: string }
    ): Promise<User> => {
      // Basic validation
      if (!username || username.trim().length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }
      if (!password || password.length < 5) {
        throw new Error('Password must be at least 5 characters long');
      }
      if (!email || !email.includes('@')) {
        throw new Error('Invalid email address');
      }

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username already taken');
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw new Error('Email already registered');
      }

      const secret = process.env.PASSWORD_SECRET;
      if (!secret) {
        throw new Error('PASSWORD_SECRET is missing from environment');
      }

      const hashedPassword = await bcrypt.hash(password + secret, 10);

      const user = await User.create({
        username,
        email,
        hashedPassword,
        isAdmin: false,
        isPremiumUser: false,
        isActive: true,
      });

      return user;
    },
  },
};
