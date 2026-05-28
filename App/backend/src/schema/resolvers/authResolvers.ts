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
      const trimmedUsername = username ? username.trim() : '';
      const user = await User.findOne({ where: { username: trimmedUsername } });

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
      // Strict input validations
      const trimmedUsername = username ? username.trim() : '';
      const trimmedEmail = email ? email.trim() : '';

      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      if (!usernameRegex.test(trimmedUsername)) {
        throw new Error(
          'Username must be 3-30 characters long and contain only letters, numbers, underscores, or hyphens'
        );
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (
        !trimmedEmail ||
        trimmedEmail.length > 254 ||
        !emailRegex.test(trimmedEmail)
      ) {
        throw new Error('Please provide a valid email address');
      }

      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter');
      }
      if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number');
      }
      if (!/[!@#$%^&*()_+\-=[\]{};':",./<>?\\|]/.test(password)) {
        throw new Error('Password must contain at least one special character');
      }

      const existingUser = await User.findOne({
        where: { username: trimmedUsername },
      });
      if (existingUser) {
        throw new Error('Username already taken');
      }

      const existingEmail = await User.findOne({
        where: { email: trimmedEmail },
      });
      if (existingEmail) {
        throw new Error('Email already registered');
      }

      const secret = process.env.PASSWORD_SECRET;
      if (!secret) {
        throw new Error('PASSWORD_SECRET is missing from environment');
      }

      const hashedPassword = await bcrypt.hash(password + secret, 10);

      const user = await User.create({
        username: trimmedUsername,
        email: trimmedEmail,
        hashedPassword,
        isAdmin: false,
        isPremiumUser: false,
        isActive: true,
      });

      return user;
    },
  },
};
