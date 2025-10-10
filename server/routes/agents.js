const express = require('express');
const router = express.Router();
const {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');

// All routes are prefixed with /api/agents

// GET /api/agents - Get all agents
router.get('/', getAllAgents);

// GET /api/agents/:id - Get single agent
router.get('/:id', getAgentById);

// POST /api/agents - Create new agent
router.post('/', createAgent);

// PUT /api/agents/:id - Update agent
router.put('/:id', updateAgent);

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', deleteAgent);

module.exports = router;
