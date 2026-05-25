import { Link } from 'react-router-dom';

export default function Account() {
  return (
    <div className="container flex-center main-container">
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">Account Information</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            color: 'var(--text-primary)',
          }}
        >
          <p>
            <strong>Username:</strong> Player1
          </p>
          <p>
            <strong>Email:</strong> player1@example.com
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span style={{ color: 'var(--color-warning)' }}>
              Not implemented yet
            </span>
          </p>
        </div>
        <div
          style={{
            marginTop: 'var(--space-xl)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link to="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
