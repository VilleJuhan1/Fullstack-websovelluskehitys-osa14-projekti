import { createContext, useContext, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_DATA } from '../services/gameData';
import type { AllGameData, GameItem, GameDataType } from '../services/gameData';

interface GameContextType {
  pokemon: GameItem[];
  countries: GameItem[];
  loading: boolean;
  error: unknown;
  getItems: (type: GameDataType) => GameItem[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/* GameProvider fetches all game date once when the app mounts provides it via context to child components */
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error } = useQuery<AllGameData>(GET_ALL_DATA);

  // Derive arrays directly from Apollo data, iterate later if for some reason tens of quizzes
  const pokemon = useMemo(() => data?.allPokemon ?? [], [data]);
  const countries = useMemo(() => data?.allCountries ?? [], [data]);

  // Stable accessor for Quiz components
  const getItems = useCallback(
    (type: GameDataType): GameItem[] => {
      return type === 'pokemon' ? pokemon : countries;
    },
    [pokemon, countries]
  );

  return (
    <GameContext.Provider
      value={{ pokemon, countries, loading, error, getItems }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return ctx;
};
