import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';
import * as api from '../api/api';

const ACTIONS = [
  {
    key: 'deposit',
    title: 'Deposit',
    desc: 'Add funds to your account',
    iconClass: 'deposit',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
      </svg>
    ),
  },
  {
    key: 'withdraw',
    title: 'Withdraw',
    desc: 'Take out funds from your account',
    iconClass: 'withdraw',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
      </svg>
    ),
  },
  {
    key: 'transfer',
    title: 'Transfer',
    desc: 'Send money to another account',
    iconClass: 'transfer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
  },
];

export default function Dashboard() {
  const { session, txLocked, refreshAccount } = useAuth();
  const navigate = useNavigate();
  

  // Redirect if not logged in
  useEffect(() => {
    if (!session) navigate('/login', { replace: true });
  }, [session]);

  if (!session) return null;

  const { account, customerId } = session;

  const handleAction = (actionKey) => {
    if (txLocked) return; // blocked — ActionPage will show the message too
    navigate(`/action/${actionKey}`);
  };
  // Refresh account balance every time dashboard loads
  useEffect(() => {
    if (!session) return;
    const fetchAccount = async () => {
      try {
        const updated = await api.getAccountByCustomer(session.customerId, session.token);
        refreshAccount(updated);
      } catch (err) {
        console.error('Failed to refresh account', err);
      }
    };
    fetchAccount();
  }, []);

  const fmtCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val ?? 0);

  const fmtDate = () =>
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

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
            <div className="topbar-user-name">{account?.customer?.name || customerId}</div>
            <div className="topbar-user-id">{customerId}</div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="page-content fade-up">

        {/* Balance Card */}
        <div className="balance-card" style={{ marginBottom: '1.5rem' }}>
          <div className="balance-label">Available Balance</div>
          <div className="balance-amount">
            <span>₹</span>
            {fmtCurrency(account?.balance)}
          </div>
          <div className="balance-meta">
            <div className="balance-meta-item">
              <span className="balance-meta-key">Account ID</span>
              <span className="balance-meta-val">{account?.accountId ?? '—'}</span>
            </div>
            <div className="balance-meta-item">
              <span className="balance-meta-key">Status</span>
              <span className={`status-badge ${account?.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                <svg width="6" height="6" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" fill="currentColor"/>
                </svg>
                {account?.status ?? '—'}
              </span>
            </div>
            <div className="balance-meta-item">
              <span className="balance-meta-key">Customer</span>
              <span className="balance-meta-val">{account?.customer?.name ?? '—'}</span>
            </div>
            <div className="balance-meta-item">
              <span className="balance-meta-key">Email</span>
              <span className="balance-meta-val">{account?.customer?.email ?? '—'}</span>
            </div>
            <div className="balance-meta-item">
              <span className="balance-meta-key">As of</span>
              <span className="balance-meta-val">{fmtDate()}</span>
            </div>
          </div>
        </div>

        {/* Locked warning */}
        {txLocked && (
          <div className="blocked-banner" style={{ marginBottom: '1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div className="blocked-banner-text">
              <strong>Transaction not possible</strong>
              <span>A transaction is pending. Please save it before starting a new one.</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="section-label">Quick Actions</div>
        <div className="actions-list">
          {ACTIONS.map((action) => (
            <button
              key={action.key}
              className="action-btn"
              onClick={() => handleAction(action.key)}
              disabled={txLocked}
              style={txLocked ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
            >
              <div className={`action-btn-icon ${action.iconClass}`}>
                {action.icon}
              </div>
              <div className="action-btn-text">
                <div className="action-btn-title">{action.title}</div>
                <div className="action-btn-desc">{action.desc}</div>
              </div>
              <div className="action-btn-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* View History */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => navigate('/history')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.02-5.2"/>
            </svg>
            View Transaction History
          </button>
        </div>

      </main>
    </div>
  );
}
