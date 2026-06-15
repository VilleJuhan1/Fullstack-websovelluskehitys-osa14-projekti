import { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_DATA } from '../services/gameData';
import type { AllGameData, GameDataType, GameItem } from '../services/gameData';
import { GameContext } from '../hooks/useGame';

// GameProvider fetches all game data once when the app mounts and provides it via context
export function GameProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useQuery<AllGameData>(GET_ALL_DATA);

  const pokemon = useMemo(() => data?.allPokemon ?? [], [data]);
  const countries = useMemo(() => data?.allCountries ?? [], [data]);
  const dota = useMemo(() => {
    const heroes = data?.allDotaHeroes ?? [];
    return heroes.map(hero => ({
      ...hero,
      categories: hero.categories.map(c => c === 'all' ? 'universal' : c)
    }));
  }, [data]);

  const getItems = useCallback(
    (type: GameDataType): GameItem[] => {
      if (type === 'pokemon') return pokemon;
      if (type === 'dota') return dota;
      return countries;
    },
    [pokemon, countries, dota]
  );

  return (
    <GameContext.Provider
      value={{ pokemon, countries, dota, loading, error, getItems }}
    >
      {children}
    </GameContext.Provider>
  );
}
