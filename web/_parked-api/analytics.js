// API route for analytics tracking
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'vyapar';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();

    if (req.method === 'POST') {
      const { type, data, shopId } = req.body;

      if (!type || !data) {
        return res.status(400).json({ error: 'Missing type or data parameters' });
      }

      const analyticsCollection = db.collection('analytics');

      const analyticsData = {
        type,
        data,
        shopId,
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      };

      await analyticsCollection.insertOne(analyticsData);

      return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
      const { type, shopId, startDate, endDate } = req.query;

      const analyticsCollection = db.collection('analytics');

      const filter = {};
      if (type) filter.type = type;
      if (shopId) filter.shopId = shopId;
      if (startDate && endDate) {
        filter.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const analytics = await analyticsCollection
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(1000)
        .toArray();

      return res.status(200).json(analytics);
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
