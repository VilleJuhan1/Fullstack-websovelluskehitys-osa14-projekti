import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CategorySelector } from '../CategorySelector';

describe('CategorySelector Component', () => {
  const categories = ['all', 'europe', 'asia'];

  it('renders correctly with given categories', () => {
    render(
      <CategorySelector
        categories={categories}
        selectedCategory="all"
        onSelectCategory={vi.fn()}
      />
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
    
    // Check if options exist and are capitalized
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Europe' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Asia' })).toBeInTheDocument();
  });

  it('calls onSelectCategory when a new category is selected', async () => {
    const onSelectMock = vi.fn();
    const user = userEvent.setup();

    render(
      <CategorySelector
        categories={categories}
        selectedCategory="all"
        onSelectCategory={onSelectMock}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'europe');

    expect(onSelectMock).toHaveBeenCalledWith('europe');
  });
});
