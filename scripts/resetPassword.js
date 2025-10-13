// Reset a user's password by email.
// Usage: node scripts/resetPassword.js <email> <newPassword>
// Requires MONGODB_URI and DB_NAME in environment (same as backend/db.js expects)

const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Agent = require('../models/Agent');

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
}

async function run() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    console.error('Usage: node scripts/resetPassword.js <email> <newPassword>');
    process.exit(1);
  }
  await connectDB();
  const normalizedEmail = String(email).trim().toLowerCase();
  const agent = await Agent.findOne({ email: normalizedEmail }).select('+password');
  if (!agent) {
    console.error('Agent not found:', normalizedEmail);
    process.exit(2);
  }
  agent.password = await bcrypt.hash(newPassword, 10);
  await agent.save();
  console.log('Password reset OK for', normalizedEmail);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
