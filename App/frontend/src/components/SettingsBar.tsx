import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client/react';
import { ME } from '../services/auth';
import type { GetMeData } from '../services/auth';
import './SettingsBar.css';

export default function SettingsBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const apolloClient = useApolloClient();

  const { data, refetch } = useQuery<GetMeData>(ME, {
    fetchPolicy: 'cache-and-network',
  });

  // Listen to custom auth changes (e.g. login/signup events)
  useEffect(() => {
    const handleAuthChange = () => {
      refetch();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [refetch]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('quiz-user-token');
    await apolloClient.clearStore();
    refetch();
    setIsOpen(false);
  };

  const showDevBar = import.meta.env.VITE_SHOW_DEV_BAR === 'true';
  const user = data?.me;

  return (
    <div
      ref={menuRef}
      className="settings-bar-container"
      style={{ top: showDevBar ? 'calc(var(--space-lg) + 36px)' : undefined }}
    >
      <button
        className="settings-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
        aria-label="Settings"
      >
        <img
          src="/cogwheel.svg"
          alt="Settings"
          style={{ width: 20, height: 20, filter: 'invert(1)' }}
        />
      </button>

      {isOpen && (
        <div className="glass-panel settings-dropdown">
          {user ? (
            <>
              <div
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  fontSize: '0.85rem',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: 4,
                }}
              >
                Hi, {user.username}!
              </div>
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="settings-menu-link"
              >
                Account Information
              </Link>
              <div className="settings-divider" />
              <div
                onClick={handleLogout}
                className="settings-menu-link"
                style={{ color: 'var(--color-danger)', cursor: 'pointer' }}
              >
                Sign Out
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="settings-menu-link"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="settings-menu-link"
              >
                Sign Up
              </Link>
              <div className="settings-divider" />
              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="settings-menu-link"
              >
                Account Information
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
