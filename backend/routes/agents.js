import { Router } from 'express';
import { getCollection } from '../db.js';

const router = Router();
const COLLECTION = process.env.COLLECTION_NAME || 'agents';

// Helper: convert Extended JSON { "$date": "..." } to Date recursively
function reviveExtendedJSON(obj) {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Object.keys(obj).length === 1 && Object.prototype.hasOwnProperty.call(obj, '$date')) {
    try { return new Date(obj['$date']); } catch { return obj; }
  }
  if (Array.isArray(obj)) return obj.map(reviveExtendedJSON);
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = reviveExtendedJSON(v);
  return out;
}

router.get('/', async (req, res) => {
  try {
    const col = await getCollection(COLLECTION);
    const { page = '1', pageSize = '10', q } = req.query;
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const ps = Math.max(1, Math.min(100, parseInt(String(pageSize), 10) || 10));

    const filter = q
      ? { $or: [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { agentCode: { $regex: q, $options: 'i' } },
        ] }
      : {};

    const total = await col.countDocuments(filter);
    const items = await col.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * ps)
      .limit(ps)
      .toArray();

    res.json({ items, page: p, pageSize: ps, total, totalPages: Math.max(1, Math.ceil(total / ps)) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = reviveExtendedJSON(req.body);
    if (!payload || typeof payload !== 'object') return res.status(400).json({ error: 'Invalid body' });
    if (!payload.agentCode) return res.status(400).json({ error: 'agentCode is required' });
    if (!payload.email) return res.status(400).json({ error: 'email is required' });

    const col = await getCollection(COLLECTION);
    const exists = await col.findOne({ agentCode: payload.agentCode });
    if (exists) return res.status(409).json({ error: 'Agent already exists' });

    payload.createdAt = payload.createdAt || new Date();
    payload.updatedAt = new Date();

    const result = await col.insertOne(payload);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const col = await getCollection(COLLECTION);
    const item = await col.findOne({ agentCode: req.params.id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const col = await getCollection(COLLECTION);
    const patch = reviveExtendedJSON(req.body || {});
    patch.updatedAt = new Date();

    const result = await col.findOneAndUpdate(
      { agentCode: req.params.id },
      { $set: patch },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'Not found' });
    res.json(result.value);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const col = await getCollection(COLLECTION);
    const r = await col.deleteOne({ agentCode: req.params.id });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
