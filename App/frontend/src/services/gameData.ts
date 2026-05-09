import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { client } from '../apolloClient';

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

// The GraphQL queries
const GET_ALL_POKEMON = gql`
  query GetAllPokemon {
    allPokemon {
      id
      name
      translations { fin swe }
      categories
      imageUrl
    }
  }
`;

const GET_ALL_COUNTRIES = gql`
  query GetAllCountries {
    allCountries {
      id
      name
      translations { fin swe }
      categories
      imageUrl
    }
  }
`;

// Define the expected shape of our query response
export interface QueryData {
  allPokemon?: GameItem[];
  allCountries?: GameItem[];
}

/* React hook to fetch data inside components using ApolloClient*/
export const useGameData = (type: GameDataType) => {
  const query = type === 'pokemon' ? GET_ALL_POKEMON : GET_ALL_COUNTRIES;
  const { data, loading, error, refetch } = useQuery<QueryData>(query);

  let items: GameItem[] = [];
  if (data) {
    items = type === 'pokemon' ? data.allPokemon || [] : data.allCountries || [];
  }

  return { items, loading, error, refetch };
};

/* Standalone service to use outside React components*/
export const fetchGameData = async (type: GameDataType): Promise<GameItem[]> => {
  const query = type === 'pokemon' ? GET_ALL_POKEMON : GET_ALL_COUNTRIES;

  const { data } = await client.query<QueryData>({ query });
  return type === 'pokemon' ? data.allPokemon || [] : data.allCountries || [];
};
