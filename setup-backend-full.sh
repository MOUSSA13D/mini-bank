#!/bin/bash

# Crée la structure du backend
mkdir -p server/{controllers,models,routes}

# --- Création des fichiers principaux ---
cat > server/package.json <<EOL
{
  "name": "mini-bank-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOL

cat > server/.env <<EOL
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net
DB_NAME=minibank
JWT_SECRET=supersecretkey
PORT=4000
EOL

cat > server/db.js <<EOL
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('✅ MongoDB connecté !');
  } catch (error) {
    console.error('❌ Erreur MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
EOL

cat > server/index.js <<EOL
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
app.listen(PORT, () => console.log(\`🚀 Serveur lancé sur le port \${PORT}\`));
EOL

# --- Models ---
cat > server/models/Agent.js <<EOL
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AgentSchema = new mongoose.Schema({
  agentCode: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
}, { timestamps: true });

AgentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AgentSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Agent', AgentSchema);
EOL

cat > server/models/Transaction.js <<EOL
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
EOL

# --- Controllers ---
cat > server/controllers/authController.js <<EOL
const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');

const generateToken = (agentId) => {
  return jwt.sign({ id: agentId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const agent = await Agent.findOne({ email });
  if (!agent) return res.status(401).json({ message: 'Agent non trouvé' });

  const isMatch = await agent.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

  res.json({
    _id: agent._id,
    email: agent.email,
    fullName: \`\${agent.firstName} \${agent.lastName}\`,
    token: generateToken(agent._id),
  });
};
EOL

cat > server/controllers/agentController.js <<EOL
const Agent = require('../models/Agent');

exports.getAgents = async (req, res) => {
  const agents = await Agent.find();
  res.json(agents);
};

exports.createAgent = async (req, res) => {
  try {
    const { agentCode, firstName, lastName, email, phone, password } = req.body;
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) return res.status(400).json({ message: 'Email déjà utilisé' });

    const agent = new Agent({ agentCode, firstName, lastName, email, phone, password });
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
EOL

cat > server/controllers/transactionController.js <<EOL
const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find().populate('agent', 'firstName lastName email');
  res.json(transactions);
};

exports.createTransaction = async (req, res) => {
  try {
    const { agent, amount, type } = req.body;
    const transaction = new Transaction({ agent, amount, type, status: 'completed' });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction non trouvée' });

    transaction.status = 'canceled';
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
EOL

# --- Routes ---
cat > server/routes/auth.js <<EOL
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;
EOL

cat > server/routes/agents.js <<EOL
const express = require('express');
const router = express.Router();
const { getAgents, createAgent } = require('../controllers/agentController');

router.get('/', getAgents);
router.post('/', createAgent);

module.exports = router;
EOL

cat > server/routes/transactions.js <<EOL
const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  cancelTransaction,
} = require('../controllers/transactionController');

router.get('/', getTransactions);
router.post('/', createTransaction);
router.patch('/cancel/:id', cancelTransaction);

module.exports = router;
EOL

echo "✅ Backend complet créé avec tout le code !"

