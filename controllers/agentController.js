const Agent = require('../models/Agent');

exports.getAgents = async (req, res) => {
  const agents = await Agent.find();
  res.json(agents);
};

exports.createAgent = async (req, res) => {
  try {
    // Debug: log incoming body to help diagnose missing fields
    console.log('createAgent body:', req.body);

    // Validate required fields early and return 400 if missing
    const required = ['agentCode', 'firstName', 'lastName', 'email', 'password'];
    const missing = required.filter((k) => !req.body || req.body[k] === undefined || req.body[k] === '');
    if (missing.length > 0) {
      return res.status(400).json({ message: 'Champs requis manquants', missing });
    }

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
