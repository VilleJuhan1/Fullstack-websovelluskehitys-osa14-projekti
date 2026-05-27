import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../services/auth';
import type { LoginData } from '../services/auth';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation<LoginData>(LOGIN, {
    onError: (err: Error) => {
      setErrorText(err.message || 'An error occurred during login');
    },
    onCompleted: (data: LoginData) => {
      if (data?.login?.value) {
        localStorage.setItem('quiz-user-token', data.login.value);
        // Dispatch custom event to notify SettingsBar and other components of auth status change
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    loginMutation({ variables: { username, password } });
  };

  return (
    <div className="container flex-center main-container">
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">Login</h1>
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}
        >
          {errorText && (
            <p
              className="quiz-error-text"
              style={{ textAlign: 'center', margin: 0, fontWeight: 600 }}
            >
              {errorText}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)',
              marginTop: 'var(--space-lg)',
              textAlign: 'center',
            }}
          >
            <label
              htmlFor="username"
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)',
              marginTop: 'var(--space-lg)',
              textAlign: 'center',
            }}
          >
            <label
              htmlFor="password"
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={loading}
            />
          </div>
          <button type="submit" className="streak-score-btn" disabled={loading}>
            <h3 className="text-gradient" style={{ margin: 0 }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </h3>
          </button>
        </form>
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            marginTop: 'var(--space-xl)',
            color: 'var(--text-secondary)',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            Sign up
          </Link>
        </p>
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
