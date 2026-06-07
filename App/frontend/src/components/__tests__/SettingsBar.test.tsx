/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SettingsBar from '../SettingsBar';
import { useQuery, useApolloClient } from '@apollo/client/react';

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client/react')>();
  return {
    ...actual,
    useQuery: vi.fn(),
    useApolloClient: vi.fn(),
  };
});

describe('SettingsBar Component', () => {
  const mockClearStore = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      removeItem: vi.fn(),
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    vi.mocked(useApolloClient).mockReturnValue({
      clearStore: mockClearStore,
    } as any);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('renders toggle button', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: vi.fn(),
    } as any);

    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /settings/i });
    expect(button).toBeInTheDocument();
  });

  it('shows logged out menu when not authenticated', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: vi.fn(),
    } as any);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /settings/i });
    await user.click(button);

    expect(await screen.findByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows logged in menu when authenticated', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { me: { id: '1', username: 'testuser' } },
      refetch: vi.fn(),
    } as any);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /settings/i });
    await user.click(button);

    expect(await screen.findByText('Hi, testuser!')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('adjusts position when VITE_SHOW_DEV_BAR is true', () => {
    vi.stubEnv('VITE_SHOW_DEV_BAR', 'true');
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    const settingsContainer = container.querySelector(
      '.settings-bar-container'
    );
    expect(settingsContainer).toHaveStyle({
      top: 'calc(var(--space-lg) + 36px)',
    });
  });

  it('does not adjust position when VITE_SHOW_DEV_BAR is false', () => {
    vi.stubEnv('VITE_SHOW_DEV_BAR', 'false');
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: vi.fn(),
    } as any);

    const { container } = render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    const settingsContainer = container.querySelector(
      '.settings-bar-container'
    );
    expect(settingsContainer).not.toHaveStyle({
      top: 'calc(var(--space-lg) + 36px)',
    });
  });

  it('refetches data on auth-change event', () => {
    const mockRefetch = vi.fn();
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: mockRefetch,
    } as any);

    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    window.dispatchEvent(new Event('auth-change'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('closes menu when clicking outside', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: vi.fn(),
    } as any);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <div data-testid="outside">Outside</div>
        <SettingsBar />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /settings/i });
    await user.click(button);
    expect(screen.getByText('Login')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('handles logout properly', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useQuery).mockReturnValue({
      data: { me: { id: '1', username: 'testuser' } },
      refetch: mockRefetch,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /settings/i }));

    const logoutBtn = screen.getByText('Sign Out');
    await user.click(logoutBtn);

    expect(localStorage.removeItem).toHaveBeenCalledWith('quiz-user-token');
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      'quiz-user-token-expires'
    );
    expect(mockClearStore).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('closes menu when a link is clicked', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { me: null },
      refetch: vi.fn(),
    } as any);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /settings/i }));

    const loginLink = screen.getByText('Login');
    await user.click(loginLink);

    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('closes menu when account link is clicked while logged in', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: { me: { id: '1', username: 'testuser' } },
      refetch: vi.fn(),
    } as any);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SettingsBar />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /settings/i }));

    const accountLink = screen.getByText('Account Information');
    await user.click(accountLink);

    expect(screen.queryByText('Account Information')).not.toBeInTheDocument();
  });
});
