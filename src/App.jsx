import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage    from './pages/LoginPage';
import Dashboard    from './pages/Dashboard';
import ActionPage   from './pages/ActionPage';
import HistoryPage  from './pages/HistoryPage';

// ── Protected Route wrapper ────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const { session } = useAuth();
  return session ? children : <Navigate to="/login" replace />;
}

// ── Public Route wrapper (redirect if already logged in) ──────────────────
function PublicRoute({ children }) {
  const { session } = useAuth();
  return session ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          <Route path="/action/:action" element={
            <PrivateRoute><ActionPage /></PrivateRoute>
          } />

          <Route path="/history" element={
            <PrivateRoute><HistoryPage /></PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
