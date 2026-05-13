import { QueryInterface } from 'sequelize';
import testScoresData from '../data/testScores.json';

interface TestScore {
  userId: number;
  category: string;
  totalRounds: number;
  totalRight: number;
  totalWrong: number;
  highestStreak: number;
}

// Seeds test data to the scores table for easy testing if NODE_ENV is not production
export const up = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping dev-only score seed in production.');
    return;
  }

  const formattedScores = (testScoresData as TestScore[]).map((score) => ({
    ...score,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert('scores', formattedScores);
};

export const down = async ({
  context: queryInterface,
}: {
  context: QueryInterface;
}) => {
  if (process.env.NODE_ENV === 'production') return;

  const userIds = (testScoresData as TestScore[]).map((s) => s.userId);
  await queryInterface.bulkDelete('scores', {
    userId: userIds,
  });
};
