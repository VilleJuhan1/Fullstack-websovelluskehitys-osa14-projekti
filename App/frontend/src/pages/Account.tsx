import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { ME } from '../services/auth';
import type { GetMeData } from '../services/auth';
import PaymentForm from '../components/PaymentForm';

/**
 * Account page
 *
 * @returns Account page component
 */
export default function Account() {
  const { data, loading } = useQuery<GetMeData>(ME, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <div className="container flex-center main-container">
        <div className="glass-panel main-panel">
          <h1 className="text-gradient">Loading Account...</h1>
        </div>
      </div>
    );
  }

  const user = data?.me;

  return (
    <div className="container flex-center main-container">
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">Account Information</h1>
        {user ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)',
                color: 'var(--text-primary)',
                marginTop: 'var(--space-lg)',
              }}
            >
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  style={{
                    color: user.isPremiumUser
                      ? 'var(--color-success)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {user.isPremiumUser
                    ? 'Premium Account 💎'
                    : 'Standard Account'}
                </span>
              </p>
              {user.isAdmin && (
                <p>
                  <strong style={{ color: 'var(--color-warning)' }}>
                    Admin Account ⚙️
                  </strong>
                </p>
              )}
            </div>

            {!user.isPremiumUser && <PaymentForm username={user.username} />}
          </>
        ) : (
          <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-danger)', fontWeight: 600 }}>
              You are not logged in!
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Please{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>{' '}
              or{' '}
              <Link
                to="/signup"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                }}
              >
                Sign Up
              </Link>{' '}
              to view your account details.
            </p>
          </div>
        )}
        <div
          style={{
            marginTop: 'var(--space-xl)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
