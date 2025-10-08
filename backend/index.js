// routes/agents.js
import express from 'express';
const router = express.Router();

// Liste fictive d'agents
const agents = [
  { email: 'moussa@gmail.com', password: '123456', name: 'Moussa Diatta' },
  { email: 'agent2@gmail.com', password: 'abcdef', name: 'Agent Deux' },
];

// Route login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
  }

  const agent = agents.find(a => a.email === email && a.password === password);

  if (agent) {
    res.json({ success: true, email: agent.email, name: agent.name });
  } else {
    res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
  }
});

export default router;
