import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGameContext, GameContext } from '../useGame';

describe('useGame Hook', () => {
  it('throws an error when used outside of GameProvider', () => {
    // Suppress React's error boundary console logs for expected errors
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useGameContext())).toThrow(
      'useGameContext must be used within a GameProvider'
    );

    consoleSpy.mockRestore();
  });

  it('returns context value when used within GameProvider', () => {
    const mockValue = {
      pokemon: [],
      countries: [],
      dota: [],
      loading: false,
      error: null,
      getItems: () => [],
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameContext.Provider value={mockValue}>{children}</GameContext.Provider>
    );

    const { result } = renderHook(() => useGameContext(), { wrapper });

    expect(result.current).toEqual(mockValue);
  });
});
