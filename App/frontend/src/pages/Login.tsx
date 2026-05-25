import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual login logic
    console.log('Logging in with:', { username, password });
    alert('Login framework placeholder triggered!');
    navigate('/');
  };

  return (
    <div className="container flex-center main-container" >
      <div className="glass-panel main-panel">
        <h1 className="text-gradient">Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            <label htmlFor="username" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username or Email</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="streak-score-btn">
            <h3 className="text-gradient" style={{ margin: 0 }}>Sign In</h3>
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign up</Link>
        </p>
        <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
