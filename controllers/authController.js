const Agent = require('../models/Agent');
const jwt = require('jsonwebtoken');
const generateToken = (agentId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Throw a clear error so callers/logs show the root cause instead of a generic 500
    throw new Error('JWT_SECRET not defined in environment');
  }
  return jwt.sign({ id: agentId }, secret, { expiresIn: '1d' });
};

// Register a new agent (signup)
exports.register = async (req, res) => {
  try {
    const { agentCode, firstName, lastName, email, phone, password } = req.body;

    if (!agentCode || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const existingAgent = await Agent.findOne({ $or: [{ email }, { agentCode }] });
    if (existingAgent) {
      return res.status(409).json({ message: 'Email ou code agent déjà utilisé' });
    }

    const agent = new Agent({ agentCode, firstName, lastName, email, phone, password });
    await agent.save();

    return res.status(201).json({
      _id: agent._id,
      email: agent.email,
      fullName: `${agent.firstName} ${agent.lastName}`,
      token: generateToken(agent._id),
    });
  } catch (error) {
    // Gestion des erreurs de clé dupliquée MongoDB
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'Conflit: valeur unique déjà existante', details: error.keyValue });
    }
    console.error('Erreur inscription:', error);
    // Environnement de développement : renvoyer le détail pour le debug
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: 'Erreur serveur', detail: error.message });
    }
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }


    const agent = await Agent.findOne({ email });
    if (!agent) return res.status(401).json({ message: 'Agent non trouvé' });

    

    const isMatch = await agent.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    return res.json({
      _id: agent._id,
      email: agent.email,
      fullName: `${agent.firstName} ${agent.lastName}`,
      token: generateToken(agent._id),
    });
  } catch (err) {
      console.error('Erreur login:', err);
      if (process.env.NODE_ENV !== 'production') {
        return res.status(500).json({ message: 'Erreur serveur', detail: err.message });
      }
      return res.status(500).json({ message: 'Erreur serveur' });
  }
};
