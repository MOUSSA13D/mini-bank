import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client;
let db;

export async function connectToDB() {
  if (db) return db;
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');
  
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(); // ou db = client.db('mini-bank') si tu veux un nom spécifique
  console.log('✅ Connected to MongoDB');
  return db;
}

export async function getCollection(name) {
  const database = await connectToDB();
  return database.collection(name);
}
