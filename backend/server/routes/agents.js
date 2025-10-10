const express = require('express');
const router = express.Router();
const { getAgents, createAgent } = require('../controllers/agentController');

router.get('/', getAgents);
router.post('/', createAgent);

module.exports = router;
