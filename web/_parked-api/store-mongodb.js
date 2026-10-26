"use strict";
const { MongoClient } = require('mongodb');

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

async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

export async function loadShop() {
  try {
    const shopsCollection = await getCollection('shops');
    const shop = await shopsCollection.findOne({});
    return shop || null;
  } catch (error) {
    console.error('Error loading shop:', error);
    return null;
  }
}

export async function saveShop(data) {
  try {
    const shopsCollection = await getCollection('shops');
    await shopsCollection.replaceOne({}, data, { upsert: true });
  } catch (error) {
    console.error('Error saving shop:', error);
  }
}

export async function loadProducts() {
  try {
    const productsCollection = await getCollection('products');
    const products = await productsCollection.find({}).toArray();
    return products || [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function saveProducts(data) {
  try {
    const productsCollection = await getCollection('products');
    await productsCollection.deleteMany({});
    if (data.length > 0) {
      await productsCollection.insertMany(data);
    }
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

export async function loadLeads() {
  try {
    const leadsCollection = await getCollection('leads');
    const leads = await leadsCollection.find({}).toArray();
    return leads || [];
  } catch (error) {
    console.error('Error loading leads:', error);
    return [];
  }
}

export async function saveLeads(data) {
  try {
    const leadsCollection = await getCollection('leads');
    await leadsCollection.deleteMany({});
    if (data.length > 0) {
      await leadsCollection.insertMany(data);
    }
  } catch (error) {
    console.error('Error saving leads:', error);
  }
}

export async function loadLeadStatuses() {
  try {
    const statusesCollection = await getCollection('leadStatuses');
    const status = await statusesCollection.findOne({});
    return status || {};
  } catch (error) {
    console.error('Error loading lead statuses:', error);
    return {};
  }
}

export async function saveLeadStatuses(data) {
  try {
    const statusesCollection = await getCollection('leadStatuses');
    await statusesCollection.replaceOne({}, data, { upsert: true });
  } catch (error) {
    console.error('Error saving lead statuses:', error);
  }
}

export function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'shop';
}

const DEFAULT_CATEGORIES = [
  { id: 'general', name: { en: 'General', hi: 'सामान्य' }, icon: '📦' },
];

export function getCategories(shop) {
  return shop?.categories || DEFAULT_CATEGORIES;
}

export async function exportAllData() {
  try {
    const shopsCollection = await getCollection('shops');
    const productsCollection = await getCollection('products');
    const leadsCollection = await getCollection('leads');
    const statusesCollection = await getCollection('leadStatuses');

    const shop = await shopsCollection.findOne({}) || null;
    const products = await productsCollection.find({}).toArray() || [];
    const leads = await leadsCollection.find({}).toArray() || [];
    const leadStatuses = await statusesCollection.findOne({}) || {};

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      shop,
      products,
      leads,
      leadStatuses,
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

export async function importAllData(data) {
  if (!data || !data.version) return false;
  
  try {
    if (data.shop) await saveShop(data.shop);
    if (data.products) await saveProducts(data.products);
    if (data.leads) await saveLeads(data.leads);
    if (data.leadStatuses) await saveLeadStatuses(data.leadStatuses);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
