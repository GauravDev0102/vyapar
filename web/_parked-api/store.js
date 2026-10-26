// API route for shop operations
import { NextApiRequest, NextApiResponse } from 'next';
import { loadShop, saveShop, loadProducts, saveProducts, loadLeads, saveLeads, loadLeadStatuses, saveLeadStatuses, exportAllData, importAllData } from '@/lib/store-mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const { type } = req.query;
        switch (type) {
          case 'shop':
            const shop = await loadShop();
            return res.status(200).json(shop);
          case 'products':
            const products = await loadProducts();
            return res.status(200).json(products);
          case 'leads':
            const leads = await loadLeads();
            return res.status(200).json(leads);
          case 'leadStatuses':
            const leadStatuses = await loadLeadStatuses();
            return res.status(200).json(leadStatuses);
          case 'export':
            const exportData = await exportAllData();
            return res.status(200).json(exportData);
          default:
            return res.status(400).json({ error: 'Invalid type parameter' });
        }
      case 'POST':
        const { operation, data } = req.body;
        switch (operation) {
          case 'shop':
            await saveShop(data);
            return res.status(200).json({ success: true });
          case 'products':
            await saveProducts(data);
            return res.status(200).json({ success: true });
          case 'leads':
            await saveLeads(data);
            return res.status(200).json({ success: true });
          case 'leadStatuses':
            await saveLeadStatuses(data);
            return res.status(200).json({ success: true });
          case 'import':
            const result = await importAllData(data);
            return res.status(200).json({ success: result });
          default:
            return res.status(400).json({ error: 'Invalid operation parameter' });
        }
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
