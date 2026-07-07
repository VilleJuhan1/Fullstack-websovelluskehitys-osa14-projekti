import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import QuizButton from '../QuizButton';

/**
 * Vitest tests for the QuizButton component to ensure the quiz button is rendered correctly and responds to user input.
 */
describe('QuizButton Component', () => {
  const mockItem = {
    id: 1,
    name: 'Test Item',
    imageUrl: '/test-url.png',
    categories: ['test'],
  };

  it('renders an image with correct src', () => {
    render(<QuizButton item={mockItem} onClick={vi.fn()} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockItem.imageUrl);
  });

  it('calls onClick with the item when clicked', async () => {
    const onClickMock = vi.fn();
    const user = userEvent.setup();

    render(<QuizButton item={mockItem} onClick={onClickMock} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).toHaveBeenCalledWith(mockItem);
  });
});
