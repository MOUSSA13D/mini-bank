import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import agentsRouter from './routes/agents.js';

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Route santé
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes principales
app.use('/agents', agentsRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
