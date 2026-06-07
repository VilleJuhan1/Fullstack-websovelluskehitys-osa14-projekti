import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import QuizGrid from '../QuizGrid';

describe('QuizGrid Component', () => {
  const mockOptions = [
    { id: 1, name: 'Item 1', imageUrl: '/item1.png', categories: ['test'] },
    { id: 2, name: 'Item 2', imageUrl: '/item2.png', categories: ['test'] },
    { id: 3, name: 'Item 3', imageUrl: '/item3.png', categories: ['test'] },
    { id: 4, name: 'Item 4', imageUrl: '/item4.png', categories: ['test'] },
  ];

  it('renders the correct number of quiz buttons', () => {
    render(<QuizGrid options={mockOptions} onSelect={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    expect(images[0]).toHaveAttribute('src', mockOptions[0].imageUrl);
    expect(images[3]).toHaveAttribute('src', mockOptions[3].imageUrl);
  });

  it('passes the clicked item to onSelect', async () => {
    const onSelectMock = vi.fn();
    const user = userEvent.setup();

    render(<QuizGrid options={mockOptions} onSelect={onSelectMock} />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);

    expect(onSelectMock).toHaveBeenCalledWith(mockOptions[1]);
  });
});
