import { createContext, useContext } from 'react';
import type { GameItem, GameDataType } from '../services/gameData';

/**
 * Interface for the GameContextType, which is used to share game data between components.
 */
export interface GameContextType {
  pokemon: GameItem[];
  countries: GameItem[];
  dota: GameItem[];
  kana: GameItem[];
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
