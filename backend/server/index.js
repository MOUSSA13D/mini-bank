const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
