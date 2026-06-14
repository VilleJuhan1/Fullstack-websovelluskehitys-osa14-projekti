import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      expiresAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email: $email) {
      id
      username
    }
  }
`;

export const UPGRADE_TO_PREMIUM = gql`
  mutation UpgradeToPremium($paymentMethodId: String!) {
    upgradeToPremium(paymentMethodId: $paymentMethodId) {
      id
      username
      isPremiumUser
    }
  }
`;

export const ME = gql`
  query GetMe {
    me {
      id
      username
      email
      isAdmin
      isPremiumUser
      scores {
        id
        category
        highestStreak
      }
    }
  }
`;

export interface LoginData {
  login: {
    value: string;
    expiresAt: number;
  };
}

export interface CreateUserData {
  createUser: {
    id: number;
    username: string;
  };
}

export interface UpgradeData {
  upgradeToPremium: {
    id: number;
    username: string;
    isPremiumUser: boolean;
  };
}

export interface ScoreItem {
  id: number;
  category: string;
  highestStreak: number;
}

export interface GetMeData {
  me?: {
    id: number;
    username: string;
    email?: string;
    isAdmin?: boolean;
    isPremiumUser?: boolean;
    scores?: ScoreItem[];
  } | null;
}
