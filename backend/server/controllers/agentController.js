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
