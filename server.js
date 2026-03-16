const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SPRING_BASE = 'http://localhost:8087';

// ── Login ──────────────────────────────────────────────────────────────────
// Validates credentials by hitting a protected endpoint with Basic Auth
app.post('/auth/login', async (req, res) => {
  const { customerId, password } = req.body;

  if (!customerId || !password) {
    return res.status(400).json({ error: 'customerId and password are required' });
  }

  const token = Buffer.from(`${customerId}:${password}`).toString('base64');

  try {
    // Hit transaction endpoint (requires authentication) to validate credentials
    const accountRes = await axios.get(
      `${SPRING_BASE}/api/accounts/customer/${customerId}`,
      { headers: { Authorization: `Basic ${token}` } }
    );
    res.json({ account: accountRes.data, token });
  } catch (err) {
    const status = err.response?.status || 500;
    if (status === 401 || status === 403) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(status).json({ error: err.message });
  }
});

// ── Account ────────────────────────────────────────────────────────────────
app.get('/api/accounts/customer/:customerId', async (req, res) => {
  try {
    const response = await axios.get(
      `${SPRING_BASE}/api/accounts/customer/${req.params.customerId}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get('/api/accounts/:accountId', async (req, res) => {
  try {
    const response = await axios.get(
      `${SPRING_BASE}/api/accounts/${req.params.accountId}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── Transactions ───────────────────────────────────────────────────────────
app.post('/api/transactions/deposit', async (req, res) => {
  try {
    const response = await axios.post(
      `${SPRING_BASE}/api/transactions/deposit`,
      req.body,
      { headers: { Authorization: req.headers.authorization, 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

app.post('/api/transactions/withdraw', async (req, res) => {
  try {
    const response = await axios.post(
      `${SPRING_BASE}/api/transactions/withdraw`,
      req.body,
      { headers: { Authorization: req.headers.authorization, 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

app.post('/api/transactions/transfer', async (req, res) => {
  try {
    const response = await axios.post(
      `${SPRING_BASE}/api/transactions/transfer`,
      req.body,
      { headers: { Authorization: req.headers.authorization, 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

app.get('/api/transactions/account/:accountId', async (req, res) => {
  try {
    const response = await axios.get(
      `${SPRING_BASE}/api/transactions/account/${req.params.accountId}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n  🏦  Proxy server running on http://localhost:${PORT}`);
  console.log(`  ↪   Forwarding to Spring Boot at ${SPRING_BASE}\n`);
});
