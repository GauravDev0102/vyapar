// Client-side store wrapper that calls API routes
const API_BASE_URL = '/api/store';

export async function loadShop() {
  try {
    const response = await fetch(`${API_BASE_URL}?type=shop`);
    if (!response.ok) throw new Error('Failed to fetch shop');
    return await response.json();
  } catch (error) {
    console.error('Error loading shop:', error);
    return null;
  }
}

export async function saveShop(data) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'shop', data }),
    });
    if (!response.ok) throw new Error('Failed to save shop');
    return await response.json();
  } catch (error) {
    console.error('Error saving shop:', error);
  }
}

export async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}?type=products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function saveProducts(data) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'products', data }),
    });
    if (!response.ok) throw new Error('Failed to save products');
    return await response.json();
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

export async function loadLeads() {
  try {
    const response = await fetch(`${API_BASE_URL}?type=leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return await response.json();
  } catch (error) {
    console.error('Error loading leads:', error);
    return [];
  }
}

export async function saveLeads(data) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'leads', data }),
    });
    if (!response.ok) throw new Error('Failed to save leads');
    return await response.json();
  } catch (error) {
    console.error('Error saving leads:', error);
  }
}

export async function loadLeadStatuses() {
  try {
    const response = await fetch(`${API_BASE_URL}?type=leadStatuses`);
    if (!response.ok) throw new Error('Failed to fetch lead statuses');
    return await response.json();
  } catch (error) {
    console.error('Error loading lead statuses:', error);
    return {};
  }
}

export async function saveLeadStatuses(data) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'leadStatuses', data }),
    });
    if (!response.ok) throw new Error('Failed to save lead statuses');
    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}?type=export`);
    if (!response.ok) throw new Error('Failed to export data');
    return await response.json();
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

export async function importAllData(data) {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'import', data }),
    });
    if (!response.ok) throw new Error('Failed to import data');
    return await response.json();
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
