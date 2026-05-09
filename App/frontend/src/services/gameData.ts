import { gql } from '@apollo/client';

export type GameDataType = 'pokemon' | 'countries';

export interface Translations {
  fin?: string;
  swe?: string;
}

// The backend serves list of some ObjectType objects which translate into 'GameItem' on the frontend
export interface GameItem {
  id: number;
  name: string;
  translations?: Translations | null;
  categories: string[];
  imageUrl: string;
}

// Single query that fetches all game data on startup
export const GET_ALL_DATA = gql`
  query GetAllData {
    allPokemon {
      id
      name
      translations {
        fin
        swe
      }
      categories
      imageUrl
    }
    allCountries {
      id
      name
      translations {
        fin
        swe
      }
      categories
      imageUrl
    }
  }
`;

// Define the expected shape of our combined query response
export interface AllGameData {
  allPokemon: GameItem[];
  allCountries: GameItem[];
}
