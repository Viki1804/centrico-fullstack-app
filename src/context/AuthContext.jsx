import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY   = 'nvault_session';
const TX_LOCK_KEY   = 'nvault_tx_lock';   // 'true' when a tx is pending save

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const [txLocked, setTxLocked] = useState(() => {
    return sessionStorage.getItem(TX_LOCK_KEY) === 'true';
  });

  // ── Login ──────────────────────────────────────────────────────────────
  const login = (customerId, token, account) => {
    const data = { customerId, token, account };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    sessionStorage.removeItem(TX_LOCK_KEY);
    setTxLocked(false);
    setSession(data);
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TX_LOCK_KEY);
    setTxLocked(false);
    setSession(null);
  };

  // ── Transaction lock helpers ───────────────────────────────────────────
  const lockTransaction = () => {
    sessionStorage.setItem(TX_LOCK_KEY, 'true');
    setTxLocked(true);
  };

  const unlockTransaction = () => {
    sessionStorage.removeItem(TX_LOCK_KEY);
    setTxLocked(false);
  };

  // ── Update account balance after successful transaction ────────────────
  const refreshAccount = (updatedAccount) => {
    if (!session) return;
    const data = { ...session, account: updatedAccount };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    setSession(data);
  };

  return (
    <AuthContext.Provider
      value={{ session, login, logout, txLocked, lockTransaction, unlockTransaction, refreshAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
