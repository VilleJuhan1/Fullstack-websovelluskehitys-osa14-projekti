import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing up with:', { username, email, password });
    alert('Signup framework placeholder triggered!');
    navigate('/');
  };

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
            />
          </div>
          <button type="submit" className="streak-score-btn">
            <h3 className="text-gradient" style={{ margin: 0 }}>
              Create Account
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
