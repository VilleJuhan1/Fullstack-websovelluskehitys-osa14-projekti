// Written by Gemini 3.5 Flash
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Quiz from '../Quiz';
import { useQuery, useMutation } from '@apollo/client/react';
import { useGameContext } from '../../hooks/useGame';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../../hooks/useGame', () => ({
  useGameContext: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => ({ category: 'countries' }),
    useNavigate: () => vi.fn(),
  };
});

describe('Quiz Component - Streak Logic & Target Item Duplication', () => {
  const mockItems = [
    { id: '1', name: 'Finland', imageUrl: '/flags/fi.svg', categories: ['europe'] },
    { id: '2', name: 'Sweden', imageUrl: '/flags/se.svg', categories: ['europe'] },
    { id: '3', name: 'Norway', imageUrl: '/flags/no.svg', categories: ['europe'] },
    { id: '4', name: 'Denmark', imageUrl: '/flags/dk.svg', categories: ['europe'] },
  ];

  const mockUpdateStreakScore = vi.fn().mockResolvedValue({
    data: {
      updateStreakScore: {
        category: 'countries',
        highestStreak: 2,
      },
    },
  });

  beforeEach(() => {
    vi.mocked(useGameContext).mockReturnValue({
      pokemon: [],
      countries: mockItems,
      dota: [],
      loading: false,
      error: null,
      getItems: (type: string) => {
        if (type === 'countries') return mockItems;
        return [];
      },
    } as any);

    vi.mocked(useQuery).mockReturnValue({
      data: {
        me: {
          id: '1',
          username: 'testuser',
          isPremiumUser: true,
          scores: [], // Empty scores = initial record is 0
        },
      },
      loading: false,
    } as any);

    vi.mocked(useMutation).mockReturnValue([
      mockUpdateStreakScore,
      { loading: false, error: null } as any,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('does not trigger mutation or new record flag on streak 1, but does on streak 2', async () => {
    const { container } = render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    );

    // Wait for the initial question to be generated (scheduled via Promise.resolve().then inside useEffect)
    expect(await screen.findByText('Which one is:')).toBeInTheDocument();

    // --- ROUND 1 ---
    const targetName1 = container.querySelector('.quiz-target-name')?.textContent;
    expect(targetName1).toBeTruthy();

    const targetItem1 = mockItems.find((item) => item.name === targetName1);
    expect(targetItem1).toBeTruthy();

    // Find the correct button by matching image src
    const images1 = screen.getAllByRole('img');
    const correctImage1 = images1.find(
      (img) => img.getAttribute('src') === targetItem1!.imageUrl
    );
    expect(correctImage1).toBeTruthy();
    const correctButton1 = correctImage1!.closest('button');
    expect(correctButton1).toBeTruthy();

    // Click the correct button for Round 1
    await act(async () => {
      fireEvent.click(correctButton1!);
    });

    // Streak is now 1.
    // Verify that the updateStreakScore mutation was NOT called (since streak starts at 2)
    expect(mockUpdateStreakScore).not.toHaveBeenCalled();

    // Verify that isNewRecord is false (StreakScore should NOT say "New longest streak!")
    expect(
      screen.getByText('Two in a row starts a streak!')
    ).toBeInTheDocument();
    expect(screen.queryByText(/New longest streak/)).not.toBeInTheDocument();

    // Wait for the 1-second timeout to transition to the next round
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });

    // --- ROUND 2 ---
    // Wait for next target name to appear and verify it is different
    const targetName2 = await screen.findByText(/Which one is:/)
      .then(() => container.querySelector('.quiz-target-name')?.textContent);
    expect(targetName2).toBeTruthy();

    // Verify duplication logic: Target item of Round 2 MUST NOT be the same as Round 1
    expect(targetName2).not.toBe(targetName1);

    const targetItem2 = mockItems.find((item) => item.name === targetName2);
    expect(targetItem2).toBeTruthy();

    // Find the correct button for Round 2
    const images2 = screen.getAllByRole('img');
    const correctImage2 = images2.find(
      (img) => img.getAttribute('src') === targetItem2!.imageUrl
    );
    expect(correctImage2).toBeTruthy();
    const correctButton2 = correctImage2!.closest('button');
    expect(correctButton2).toBeTruthy();

    // Click the correct button for Round 2
    await act(async () => {
      fireEvent.click(correctButton2!);
    });

    // Streak is now 2.
    // Verify that the updateStreakScore mutation was called since streak >= 2
    expect(mockUpdateStreakScore).toHaveBeenCalledTimes(1);
    expect(mockUpdateStreakScore).toHaveBeenCalledWith({
      variables: {
        category: 'countries',
        streak: 2,
      },
      update: expect.any(Function),
    });

    // Verify that isNewRecord is true (StreakScore should show new record title)
    expect(screen.getByText(/New longest streak! 2/)).toBeInTheDocument();
  });
});
