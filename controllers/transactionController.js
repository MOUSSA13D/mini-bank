const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find().populate('agent', 'firstName lastName email');
  res.json(transactions);
};

exports.createTransaction = async (req, res) => {
  try {
    const { agent, amount, type } = req.body;
    const transaction = new Transaction({ agent, amount, type, status: 'completed' });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction non trouvée' });

    transaction.status = 'canceled';
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
