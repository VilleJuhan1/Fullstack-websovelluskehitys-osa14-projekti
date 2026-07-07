import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BottomBar from '../BottomBar';

/**
 * Vitest tests for the BottomBar component to ensure the social media links are rendered correctly.
 */
describe('BottomBar Component', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_LINKEDIN_URL', 'https://mock-linkedin.com');
    vi.stubEnv('VITE_GITHUB_URL', 'https://mock-github.com');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders social media links with mock environment variables', () => {
    render(<BottomBar />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', 'https://mock-linkedin.com');
    expect(links[1]).toHaveAttribute('href', 'https://mock-github.com');
  });

  it('renders fallback links when environment variables are missing', () => {
    vi.stubEnv('VITE_LINKEDIN_URL', '');
    vi.stubEnv('VITE_GITHUB_URL', '');
    render(<BottomBar />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute('href', 'https://linkedin.com');
    expect(links[1]).toHaveAttribute('href', 'https://github.com');
  });
});
