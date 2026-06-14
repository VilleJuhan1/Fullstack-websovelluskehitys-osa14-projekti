/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PaymentForm from '../PaymentForm';
import { useMutation } from '@apollo/client/react';

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client/react')>();
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

describe('PaymentForm Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields with default values', () => {
    vi.mocked(useMutation).mockReturnValue([
      vi.fn(),
      { loading: false, error: undefined },
    ] as any);

    render(<PaymentForm username="testuser" />);

    expect(screen.getByText('Upgrade to Premium 💎')).toBeInTheDocument();

    // Check that inputs are rendered and readonly
    const nameInput = screen.getByDisplayValue('testuser');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('readOnly');

    const cardInput = screen.getByDisplayValue('4242 4242 4242 4242');
    expect(cardInput).toBeInTheDocument();
    expect(cardInput).toHaveAttribute('readOnly');

    const expiryInput = screen.getByDisplayValue('12/28');
    expect(expiryInput).toBeInTheDocument();

    const cvcInput = screen.getByDisplayValue('123');
    expect(cvcInput).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Pay 9.99€/i })
    ).toBeInTheDocument();
  });

  it('calls upgrade mutation when form is submitted', async () => {
    const mockUpgrade = vi
      .fn()
      .mockResolvedValue({ data: { upgradeToPremium: { id: 1 } } });
    vi.mocked(useMutation).mockReturnValue([
      mockUpgrade,
      { loading: false, error: undefined },
    ] as any);

    const user = userEvent.setup();
    render(<PaymentForm username="testuser" />);

    const submitBtn = screen.getByRole('button', { name: /Pay 9.99€/i });
    await user.click(submitBtn);

    expect(mockUpgrade).toHaveBeenCalledTimes(1);
    expect(mockUpgrade).toHaveBeenCalledWith({
      variables: { paymentMethodId: 'pm_card_visa' },
    });
  });

  it('displays processing state while loading', () => {
    vi.mocked(useMutation).mockReturnValue([
      vi.fn(),
      { loading: true, error: undefined },
    ] as any);

    render(<PaymentForm username="testuser" />);

    const submitBtn = screen.getByRole('button', { name: /Processing.../i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('displays error message when mutation fails', () => {
    const errorMsg = 'Payment failed due to insufficient funds';
    vi.mocked(useMutation).mockReturnValue([
      vi.fn(),
      { loading: false, error: new Error(errorMsg) },
    ] as any);

    render(<PaymentForm username="testuser" />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });
});
