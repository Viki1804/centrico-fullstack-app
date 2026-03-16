import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';
import LogoutButton from '../components/LogoutButton';

const ACTION_META = {
  deposit:  { label: 'Deposit',  chipClass: 'chip-deposit',  verb: 'Deposit' },
  withdraw: { label: 'Withdraw', chipClass: 'chip-withdraw', verb: 'Withdraw' },
  transfer: { label: 'Transfer', chipClass: 'chip-transfer', verb: 'Transfer' },
};

export default function ActionPage() {
  const { action }                      = useParams();          // deposit | withdraw | transfer
  const { session, txLocked, lockTransaction, unlockTransaction } = useAuth();
  const navigate                        = useNavigate();

  const [amount, setAmount]             = useState('');
  const [destAccountId, setDestAccountId] = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');   // success message
  const [done, setDone]                 = useState(false); // transaction confirmed?

  const meta = ACTION_META[action];

  // Redirect if not logged in or unknown action
  useEffect(() => {
    if (!session) navigate('/login', { replace: true });
    if (!meta)    navigate('/dashboard', { replace: true });
  }, [session]);

  if (!session || !meta) return null;

  const accountId = session.account?.accountId;
  const token     = session.token;

  // ── If another tx is already locked AND this page wasn't the one that locked it
  // (done === false means this page hasn't submitted yet)
  const isBlocked = txLocked && !done;

  const handleConfirm = async () => {
    setError('');

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    if (action === 'transfer' && !destAccountId.trim()) {
      setError('Please enter the destination account ID.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (action === 'deposit') {
        result = await api.deposit(accountId, amt, token);
      } else if (action === 'withdraw') {
        result = await api.withdraw(accountId, amt, token);
      } else {
        const destId = parseInt(destAccountId.trim(), 10);
        if (isNaN(destId)) { setError('Destination account ID must be a number.'); setLoading(false); return; }
        result = await api.transfer(accountId, destId, amt, token);
      }

      // result is a plain string from the Spring controller
      const msg = typeof result === 'string' ? result : 'Transaction successful';
      setSuccess(msg);
      setDone(true);
      lockTransaction(); // block any new actions until saved

    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || err.message;
      setError(typeof msg === 'string' ? msg : 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    navigate('/history');
  };

  return (
    <div className="app-shell">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          Centrico
        </div>
        <div className="topbar-user">
          <div className="topbar-user-info">
            <div className="topbar-user-name">{session.account?.customer?.name || session.customerId}</div>
            <div className="topbar-user-id">{session.customerId}</div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="page-content">

        {/* Page Header */}
        <div className="action-page-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>
          <h1 className="action-page-title">{meta.label}</h1>
          <span className={`action-type-chip ${meta.chipClass}`}>{meta.label.toUpperCase()}</span>
        </div>

        {/* Blocked Message */}
        {isBlocked && (
          <div className="blocked-banner" style={{ maxWidth: 520 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div className="blocked-banner-text">
              <strong>Transaction not possible</strong>
              <span>A transaction is already in progress. Please save it before starting a new one.</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        {!isBlocked && (
          <div className="action-form-card">

            {/* Success Banner */}
            {done && success && (
              <div className="success-banner">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div className="success-banner-text">
                  <strong>
                    {action === 'deposit'  ? 'Deposit Successful!' :
                     action === 'withdraw' ? 'Withdrawal Successful!' :
                     'Transfer Successful!'}
                  </strong>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="alert alert-error fade-in">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:'inline', marginRight:6 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Account ID (read-only) */}
            <div className="input-group">
              <label className="input-label">
                {action === 'transfer' ? 'Source Account ID' : 'Account ID'}
              </label>
              <input
                className="input-field"
                value={accountId ?? ''}
                readOnly
                style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }}
              />
            </div>

            {/* Destination Account (transfer only) */}
            {action === 'transfer' && (
              <div className="input-group">
                <label className="input-label">Destination Account ID</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="Enter destination account ID"
                  value={destAccountId}
                  onChange={(e) => setDestAccountId(e.target.value)}
                  disabled={done}
                />
              </div>
            )}

            {/* Amount */}
            <div className="input-group">
              <label className="input-label">Amount (₹)</label>
              <input
                className="input-field"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={done}
              />
            </div>

            <div className="divider" />

            {/* Action Button */}
            {!done ? (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Processing…' : `Confirm ${meta.verb}`}
              </button>
            ) : (
              <button
                className="btn btn-success"
                style={{ width: '100%' }}
                onClick={handleSave}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.02-5.2"/>
                </svg>
                Save &amp; View History
              </button>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
