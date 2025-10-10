const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new agent
const register = async (req, res) => {
  try {
    const { name, email, phone, agency, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new agent
    const agent = new Agent({
      name,
      email,
      phone,
      agency,
      password: hashedPassword
    });

    const savedAgent = await agent.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: savedAgent._id, email: savedAgent.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Agent registered successfully',
      token,
      agent: {
        id: savedAgent._id,
        name: savedAgent.name,
        email: savedAgent.email,
        agency: savedAgent.agency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login agent
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if agent exists
    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: agent._id, email: agent.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        agency: agent.agency,
        status: agent.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get current agent profile
const getProfile = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.id);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        agency: agent.agency,
        status: agent.status,
        createdAt: agent.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const agent = await Agent.findByIdAndUpdate(
      req.agent.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        agency: agent.agency,
        status: agent.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Middleware to verify token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const agent = await Agent.findById(decoded.id);

    if (!agent) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.agent = agent;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  authenticateToken
};
