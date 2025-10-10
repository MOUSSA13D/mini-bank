const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getTransactionsByAgent,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');

// All routes are prefixed with /api/transactions

// GET /api/transactions - Get all transactions
router.get('/', getAllTransactions);

// GET /api/transactions/stats - Get transaction statistics
router.get('/stats', getTransactionStats);

// GET /api/transactions/agent/:agentId - Get transactions by agent
router.get('/agent/:agentId', getTransactionsByAgent);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', getTransactionById);

// POST /api/transactions - Create new transaction
router.post('/', createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
