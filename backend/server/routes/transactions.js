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
