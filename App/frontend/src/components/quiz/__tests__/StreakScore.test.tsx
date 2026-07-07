// Generated with Google Gemini 3.5 Flash
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StreakScore from '../StreakScore';

/**
 * Vitest tests for the StreakScore component to test core functionalities.
 */
describe('StreakScore Component', () => {
  it('renders "Make a guess!" in default state (streak = 0, attempts = 0)', () => {
    render(<StreakScore streak={0} attempts={0} />);
    expect(screen.getByText('Make a guess!')).toBeInTheDocument();
  });

  it('renders "Try again!" when attempts > 0 and streak = 0', () => {
    render(<StreakScore streak={0} attempts={1} />);
    expect(screen.getByText('Try again!')).toBeInTheDocument();
  });

  it('renders special text for streak = 1', () => {
    render(<StreakScore streak={1} />);
    expect(
      screen.getByText('Two in a row starts a streak!')
    ).toBeInTheDocument();
  });

  it('renders streak count when streak > 1', () => {
    render(<StreakScore streak={3} />);
    expect(screen.getByText('Streak: 3 🔥')).toBeInTheDocument();
  });

  it('renders personal best when user is logged in', () => {
    render(<StreakScore streak={3} isLoggedIn={true} highestStreak={5} />);
    expect(screen.getByText('Personal Best: 5 🔥')).toBeInTheDocument();
  });

  it('renders new record banner and classes when isNewRecord is true', () => {
    const { container } = render(
      <StreakScore
        streak={6}
        isLoggedIn={true}
        highestStreak={5}
        isNewRecord={true}
      />
    );

    expect(screen.getByText('New longest streak! 6 👑')).toBeInTheDocument();
    expect(
      screen.getByText('Personal Best Smashed! (Previous: 5)')
    ).toBeInTheDocument();

    // Verify record container class is applied
    expect(container.firstChild).toHaveClass('streak-new-record');
  });

  it('applies feedback-correct class when feedbackState is correct', () => {
    const { container } = render(
      <StreakScore streak={3} feedbackState="correct" />
    );
    expect(container.firstChild).toHaveClass('feedback-correct');
  });

  it('applies feedback-wrong class when feedbackState is wrong', () => {
    const { container } = render(
      <StreakScore streak={0} feedbackState="wrong" />
    );
    expect(container.firstChild).toHaveClass('feedback-wrong');
  });
});
