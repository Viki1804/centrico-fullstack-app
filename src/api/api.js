import axios from 'axios';

// All requests go to our Express proxy (port 3001, proxied via Vite on /api and /auth)
const client = axios.create({ baseURL: '/' });

// ── Auth Header ────────────────────────────────────────────────────────────
const authHeader = (token) => ({ Authorization: `Basic ${token}` });

// ── Login ──────────────────────────────────────────────────────────────────
export const login = async (customerId, password) => {
  const res = await client.post('/auth/login', { customerId, password });
  return res.data; // { account, token }
};

// ── Get Account ────────────────────────────────────────────────────────────
export const getAccountByCustomer = async (customerId, token) => {
  const res = await client.get(`/api/accounts/customer/${customerId}`, {
    headers: authHeader(token),
  });
  return res.data;
};

// ── Deposit ────────────────────────────────────────────────────────────────
export const deposit = async (accountId, amount, token) => {
  const res = await client.post(
    '/api/transactions/deposit',
    { accountId, amount },
    { headers: authHeader(token) }
  );
  return res.data;
};

// ── Withdraw ───────────────────────────────────────────────────────────────
export const withdraw = async (accountId, amount, token) => {
  const res = await client.post(
    '/api/transactions/withdraw',
    { accountId, amount },
    { headers: authHeader(token) }
  );
  return res.data;
};

// ── Transfer ───────────────────────────────────────────────────────────────
export const transfer = async (sourceAccountId, destinationAccountId, amount, token) => {
  const res = await client.post(
    '/api/transactions/transfer',
    { sourceAccountId, destinationAccountId, amount },
    { headers: authHeader(token) }
  );
  return res.data;
};

// ── Transaction History ────────────────────────────────────────────────────
export const getTransactions = async (accountId, token) => {
  const res = await client.get(`/api/transactions/account/${accountId}`, {
    headers: authHeader(token),
  });
  return res.data;
};
