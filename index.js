const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
connectDB();

// CORS configuration: allow local dev and deployed frontends
const corsOptions = {
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_ORIGIN || ''
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
