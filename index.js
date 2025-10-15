const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
connectDB();

// bien

// ------------------ CORS CONFIGURATION ------------------
const extraOrigins = (process.env.FRONTEND_ORIGIN || 'https://mini-bank7-6v88.vercel.app')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: [
    'http://localhost:5173', // frontend local
    ...extraOrigins,         // frontend déployé
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Appliquer CORS
app.use(cors(corsOptions));

// Correctif pour app.options()
app.options('*', (req, res, next) => cors(corsOptions)(req, res, next));

// Log allowed origins pour debug
console.log('CORS allowed origins:', corsOptions.origin);

// Fallback middleware pour CORS (préflight / proxies)
app.use((req, res, next) => {
  try {
    const allowed = corsOptions.origin;
    const reqOrigin = req.get('Origin');
    if (reqOrigin && Array.isArray(allowed) && allowed.includes(reqOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', reqOrigin);
    } else if (Array.isArray(allowed) && allowed.length > 0) {
      res.setHeader('Access-Control-Allow-Origin', allowed[0]);
    }
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.setHeader('Access-Control-Allow-Headers', (corsOptions.allowedHeaders || []).join(','));
    if (corsOptions.credentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
  } catch (err) {}
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
// ------------------ END CORS CONFIG ------------------

// Parse JSON
app.use(express.json());

// ------------------ ROUTES ------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/transactions', require('./routes/transactions'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mini Bank Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// ------------------ SERVER ------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
