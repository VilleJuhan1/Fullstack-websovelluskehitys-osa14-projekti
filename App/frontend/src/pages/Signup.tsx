import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LOGIN, CREATE_USER } from '../services/auth';
import type { LoginData, CreateUserData } from '../services/auth';
import './Auth.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();

  const [loginMutation, { loading: loginLoading }] = useMutation<LoginData>(
    LOGIN,
    {
      onError: (err: Error) => {
        setErrorText(
          err.message ||
            'Signup succeeded but auto-login failed. Please try logging in manually.'
        );
      },
      onCompleted: (data: LoginData) => {
        if (data?.login?.value) {
          localStorage.setItem('quiz-user-token', data.login.value);
          // Dispatch custom event to notify SettingsBar and other components of auth status change
          window.dispatchEvent(new Event('auth-change'));
          navigate('/');
        }
      },
    }
  );

  const [createUserMutation, { loading: signupLoading }] =
    useMutation<CreateUserData>(CREATE_USER, {
      onError: (err: Error) => {
        setErrorText(err.message || 'An error occurred during sign up');
      },
      onCompleted: () => {
        loginMutation({ variables: { username: username.trim(), password } });
      },
    });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      setErrorText('Username must be 3-30 characters long and contain only letters, numbers, underscores, or hyphens.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail || trimmedEmail.length > 254 || !emailRegex.test(trimmedEmail)) {
      setErrorText('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorText('Password must be at least 8 characters long.');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErrorText('Password must contain at least one lowercase letter.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorText('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setErrorText('Password must contain at least one number.');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':",./<>?\\|]/.test(password)) {
      setErrorText('Password must contain at least one special character.');
      return;
    }

    createUserMutation({ variables: { username: trimmedUsername, password, email: trimmedEmail } });
  };

  const loading = signupLoading || loginLoading;

  return (
    <div className="container flex-center main-container">
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">Sign Up</h1>
        <form
          onSubmit={handleSignup}
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
              htmlFor="email"
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </h3>
          </button>
        </form>
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            marginTop: 'var(--space-xl)',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
          >
            Login
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
