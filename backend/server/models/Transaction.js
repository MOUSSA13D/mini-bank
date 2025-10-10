const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
