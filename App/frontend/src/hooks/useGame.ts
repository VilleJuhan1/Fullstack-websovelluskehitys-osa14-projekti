import { createContext, useContext } from 'react';
import type { GameItem, GameDataType } from '../services/gameData';

//
export interface GameContextType {
  pokemon: GameItem[];
  countries: GameItem[];
  loading: boolean;
  error: unknown;
  getItems: (type: GameDataType) => GameItem[];
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

export const useGameContext = (): GameContextType => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return ctx;
};
