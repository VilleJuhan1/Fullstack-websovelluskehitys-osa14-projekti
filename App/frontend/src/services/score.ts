import { gql } from '@apollo/client';

export const UPDATE_STREAK_SCORE = gql`
  mutation UpdateStreakScore($category: String!, $streak: Int!) {
    updateStreakScore(category: $category, streak: $streak) {
      id
      category
      highestStreak
    }
  }
`;

export interface UpdateStreakScoreData {
  updateStreakScore: {
    id: number;
    category: string;
    highestStreak: number;
  };
}
