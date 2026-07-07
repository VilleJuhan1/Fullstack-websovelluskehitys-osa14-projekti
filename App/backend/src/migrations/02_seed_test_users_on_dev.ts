import { QueryInterface } from 'sequelize';
import testUsersData from '../data/testUsers.json';
import bcrypt from 'bcryptjs';
import { TestUser } from '../models/User';

// The number of iterations for hashing the passwords
const SALT_ROUNDS = 10;

/**
 * Migration file that seeds the database with test users on dev environment
 * @param queryInterface
 */
export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  // Only seed if not in a production environment
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping dev-only seed migration in production.');
    return;
  }

  const secret = process.env.PASSWORD_SECRET;
  if (!secret) {
    throw new Error('PASSWORD_SECRET is missing from environment variables');
  }

  // Map the JSON data and hash the passwords with the secret
  const formattedUsers = await Promise.all(
    (testUsersData as TestUser[]).map(async (user) => {
      const rawPassword = user.hashedpassword || user.password;

      if (!rawPassword) {
        throw new Error(`Password missing for user ${user.username}`);
      }

      // Combine raw password with the secret before hashing
      const hashedPassword = await bcrypt.hash(
        rawPassword + secret,
        SALT_ROUNDS
      );

      return {
        username: user.username,
        email: user.email,
        hashedPassword: hashedPassword,
        isAdmin: user.is_admin ?? false,
        isPremiumUser: user.is_premium_user ?? false,
        isActive: user.is_active ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    })
  );

  await queryInterface.bulkInsert('users', formattedUsers);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  if (process.env.NODE_ENV === 'production') return;

  // Cleanup test users by username when reverting migration
  const usernames = (testUsersData as TestUser[]).map((u) => u.username);
  await queryInterface.bulkDelete('users', {
    username: usernames,
  });
};
