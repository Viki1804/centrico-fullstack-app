import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';
import LogoutButton from '../components/LogoutButton';

const TX_ICONS = {
  DEPOSIT: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  ),
  WITHDRAW: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  TRANSFER: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
};

const TX_SIGN = { DEPOSIT: '+', WITHDRAW: '−', TRANSFER: '−' };

const fmtCurrency = (val) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val ?? 0);

const fmtDate = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    '  ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export default function HistoryPage() {
  const { session, unlockTransaction } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    if (!session) { navigate('/login', { replace: true }); return; }
    // Clear any lingering tx lock when user lands on history
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTransactions(session.account?.accountId, session.token);
      // Sort newest first
      const sorted = [...(Array.isArray(data) ? data : [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setTransactions(sorted);
    } catch (err) {
      setError('Could not load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

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

      <main className="page-content fade-up">

        {/* Header Row */}
        <div className="history-header">
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>Account {session.account?.accountId}</div>
            <h1 className="history-title">Transaction History</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Dashboard
            </button>
            <button className="btn btn-outline" onClick={fetchHistory} disabled={loading}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.02-5.2"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            <p style={{ marginTop: '1rem', fontSize: '0.88rem' }}>Loading transactions…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && transactions.length === 0 && (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <p>No transactions found for this account.</p>
          </div>
        )}

        {/* Transaction List */}
        {!loading && transactions.length > 0 && (
          <div className="tx-list">
            {transactions.map((tx, idx) => {
              const type = tx.type?.toUpperCase();
              const sign = TX_SIGN[type] ?? '';
              return (
                <div
                  key={tx.transactionId ?? idx}
                  className="tx-item"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <div className={`tx-icon ${type}`}>
                    {TX_ICONS[type] ?? '?'}
                  </div>
                  <div className="tx-info">
                    <div className="tx-type">{tx.type?.charAt(0) + tx.type?.slice(1).toLowerCase()}</div>
                    <div className="tx-date">{fmtDate(tx.date)}</div>
                  </div>
                  <div className={`tx-amount ${type}`}>
                    {sign}₹{fmtCurrency(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {!loading && transactions.length > 0 && (
          <p style={{ textAlign:'right', marginTop:'1rem', fontSize:'0.76rem', color:'var(--text-dim)' }}>
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} total
          </p>
        )}

      </main>
    </div>
  );
}
