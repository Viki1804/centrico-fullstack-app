import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

export default function LoginPage() {
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const { login }                   = useAuth();
  const navigate                    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerId.trim() || !password.trim()) {
      setError('Please enter your Customer ID and password.');
      return;
    }

    setLoading(true);
    try {
      const { account, token } = await api.login(customerId.trim(), password);
      login(customerId.trim(), token, account);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
          </div>
          <div className="login-title">Centrico</div>
          <div className="login-subtitle">Secure banking, simplified</div>
        </div>

        {/* Card */}
        <div className="login-card">
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>Sign in to your account</p>

          {error && (
            <div className="alert alert-error fade-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:'inline', marginRight:6 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Customer ID</label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. C001"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                autoComplete="username"
                spellCheck={false}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.75rem', color:'var(--text-dim)' }}>
          Centrico Banking System · Secured
        </p>
      </div>
    </div>
  );
}
