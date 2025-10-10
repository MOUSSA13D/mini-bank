const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  authenticateToken
} = require('../controllers/authController');

// All routes are prefixed with /api/auth

// POST /api/auth/register - Register new agent
router.post('/register', register);

// POST /api/auth/login - Login agent
router.post('/login', login);

// GET /api/auth/profile - Get current agent profile (protected)
router.get('/profile', authenticateToken, getProfile);

// PUT /api/auth/profile - Update current agent profile (protected)
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
