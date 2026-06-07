import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import DevBar from '../DevBar';

describe('DevBar Component', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not render when VITE_SHOW_DEV_BAR is not true', () => {
    vi.stubEnv('VITE_SHOW_DEV_BAR', 'false');
    const { container } = render(<DevBar />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders development tag when VITE_SHOW_DEV_BAR is true and env is dev', () => {
    vi.stubEnv('VITE_SHOW_DEV_BAR', 'true');
    vi.stubEnv('VITE_APP_ENV', 'dev');
    vi.stubEnv('VITE_APP_VERSION', 'v1.0.0-test');

    render(<DevBar />);

    expect(screen.getByText('DEVELOPMENT ENVIRONMENT')).toBeInTheDocument();
    expect(screen.getByText('VERSION: v1.0.0-test')).toBeInTheDocument();
  });

  it('renders production tag when VITE_SHOW_DEV_BAR is true and env is prod', () => {
    vi.stubEnv('VITE_SHOW_DEV_BAR', 'true');
    vi.stubEnv('VITE_APP_ENV', 'prod');
    vi.stubEnv('VITE_APP_VERSION', 'v2.0.0-prod');

    render(<DevBar />);

    expect(screen.getByText('PRODUCTION BUILD')).toBeInTheDocument();
    expect(screen.getByText('VERSION: v2.0.0-prod')).toBeInTheDocument();
  });
});
