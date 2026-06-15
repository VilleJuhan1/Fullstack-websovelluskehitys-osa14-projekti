/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useQuery } from '@apollo/client/react';
import { GameProvider } from '../GameContext';
import { useGameContext } from '../../hooks/useGame';
import React from 'react';

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client/react')>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe('GameContext and GameProvider', () => {
  const mockPokemon = [
    { id: 1, name: 'Pikachu', categories: [], imageUrl: '' },
  ];
  const mockCountries = [
    { id: 2, name: 'Finland', categories: [], imageUrl: '' },
  ];
  const mockDota = [
    { id: 3, name: 'Anti-Mage', categories: [], imageUrl: '' },
  ];

  it('provides loading state and default empty arrays when data is missing', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    } as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    const { result } = renderHook(() => useGameContext(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.pokemon).toEqual([]);
    expect(result.current.countries).toEqual([]);
    expect(result.current.dota).toEqual([]);
  });

  it('provides pokemon and countries when query is successful', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: {
        allPokemon: mockPokemon,
        allCountries: mockCountries,
        allDotaHeroes: mockDota,
      },
      loading: false,
      error: undefined,
    } as any);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );

    const { result } = renderHook(() => useGameContext(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.pokemon).toEqual(mockPokemon);
    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.dota).toEqual(mockDota);

    // Test getItems callback
    expect(result.current.getItems('pokemon')).toEqual(mockPokemon);
    expect(result.current.getItems('countries')).toEqual(mockCountries);
    expect(result.current.getItems('dota')).toEqual(mockDota);
  });
});
