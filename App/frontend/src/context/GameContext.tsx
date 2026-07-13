import { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_DATA } from '../services/gameData';
import type { AllGameData, GameDataType, GameItem } from '../services/gameData';
import { GameContext } from '../hooks/useGame';

// GameProvider fetches all game data once when the app mounts and provides it via context
export function GameProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useQuery<AllGameData>(GET_ALL_DATA);

  /* Pokemon logic changed to test out an alternative backend image source due to occasional loading issues */
  const pokemon = useMemo(() => {
    const list = data?.allPokemon ?? [];
    return list.map((p) => {
      if (
        p.imageUrl &&
        typeof p.imageUrl === 'string' &&
        p.imageUrl.startsWith('https://raw.githubusercontent.com/PokeAPI/sprites/master/')
      ) {
        return {
          ...p,
          imageUrl: p.imageUrl.replace(
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/',
            'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/'
          ),
        };
      }
      return p;
    });
  }, [data]);
  const countries = useMemo(() => data?.allCountries ?? [], [data]);
  const dota = useMemo(() => {
    const heroes = data?.allDotaHeroes ?? [];
    return heroes.map((hero) => ({
      ...hero,
      categories: hero.categories.map((c) => (c === 'all' ? 'universal' : c)),
    }));
  }, [data]);
  const kana = useMemo(() => data?.allKana ?? [], [data]);

  const getItems = useCallback(
    (type: GameDataType): GameItem[] => {
      if (type === 'pokemon') return pokemon;
      if (type === 'dota') return dota;
      if (type === 'kana') return kana;
      return countries;
    },
    [pokemon, countries, dota, kana]
  );

  return (
    <GameContext.Provider
      value={{ pokemon, countries, dota, kana, loading, error, getItems }}
    >
      {children}
    </GameContext.Provider>
  );
}
