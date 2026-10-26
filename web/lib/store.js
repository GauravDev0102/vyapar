const STORAGE_SHOP = 'vyapar_shop';
const STORAGE_PRODUCTS = 'vyapar_products';
const STORAGE_LEADS = 'vyapar_leads';
const STORAGE_LEAD_STATUS = 'vyapar_lead_status';
const STORAGE_ANALYTICS = 'vyapar_analytics';

function ls() { return typeof window !== 'undefined' ? window.localStorage : null; }

function newLeadId(index) {
  return `lead_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`;
}

export function loadShop() {
  try { return JSON.parse(ls()?.getItem(STORAGE_SHOP)) || null; } catch { return null; }
}
export function saveShop(data) { ls()?.setItem(STORAGE_SHOP, JSON.stringify(data)); }

export function loadProducts() {
  try { return JSON.parse(ls()?.getItem(STORAGE_PRODUCTS)) || []; } catch { return []; }
}
export function saveProducts(data) { ls()?.setItem(STORAGE_PRODUCTS, JSON.stringify(data)); }

export function loadLeads() {
  try { return JSON.parse(ls()?.getItem(STORAGE_LEADS)) || []; } catch { return []; }
}
export function saveLeads(data) { ls()?.setItem(STORAGE_LEADS, JSON.stringify(data)); }

export function loadLeadStatuses() {
  try { return JSON.parse(ls()?.getItem(STORAGE_LEAD_STATUS)) || {}; } catch { return {}; }
}
export function saveLeadStatuses(data) { ls()?.setItem(STORAGE_LEAD_STATUS, JSON.stringify(data)); }

export function clearAllData() {
  const storage = ls();
  if (!storage) return;
  [STORAGE_SHOP, STORAGE_PRODUCTS, STORAGE_LEADS, STORAGE_LEAD_STATUS, STORAGE_ANALYTICS]
    .forEach((key) => storage.removeItem(key));
}

// Migrates old data: leads were once tracked by array index; they now carry
// stable ids and lead statuses are keyed by lead id.
export function normalizeLeads() {
  let leads = loadLeads();
  if (!Array.isArray(leads)) return { leads: [], statuses: {} };
  let statuses = loadLeadStatuses();
  if (leads.some(l => !l.id)) {
    leads = leads.map((l, i) => {
      if (l.id) return l;
      const id = newLeadId(i);
      if (statuses[i] !== undefined) statuses[id] = statuses[i];
      return { ...l, id };
    });
    const byId = {};
    Object.entries(statuses).forEach(([k, v]) => {
      if (!/^\d+$/.test(k)) byId[k] = v;
    });
    statuses = byId;
    saveLeads(leads);
    saveLeadStatuses(statuses);
  }
  return { leads, statuses };
}

export { newLeadId };

export function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'shop';
}

const DEFAULT_CATEGORIES = [
  { id: 'general', name: { en: 'General', hi: 'सामान्य' }, icon: '📦' },
];

export function getCategories(shop) {
  return shop?.categories || DEFAULT_CATEGORIES;
}

export function exportAllData() {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    shop: loadShop(),
    products: loadProducts(),
    leads: loadLeads(),
    leadStatuses: loadLeadStatuses(),
    analytics: (() => {
      try { return JSON.parse(ls()?.getItem(STORAGE_ANALYTICS)) || []; } catch { return []; }
    })(),
  }
  return data
}

export function importAllData(data) {
  if (!data || !data.version) return false

  if (data.shop && typeof data.shop === 'object') saveShop(data.shop)
  if (Array.isArray(data.products)) saveProducts(data.products)
  if (Array.isArray(data.leads)) {
    const leads = data.leads.map((l, i) => {
      const item = { ...l };
      if (!item.id) item.id = newLeadId(i);
      return item;
    })
    saveLeads(leads)

    // Accept both statuses keyed by lead id (new) and by array index (legacy).
    const raw = (data.leadStatuses && typeof data.leadStatuses === 'object') ? data.leadStatuses : {}
    const byId = {}
    Object.entries(raw).forEach(([k, v]) => {
      if (/^\d+$/.test(k)) {
        const lead = leads[Number(k)]
        if (lead) byId[lead.id] = v
      } else {
        byId[k] = v
      }
    })
    saveLeadStatuses(byId)

    if (Array.isArray(data.analytics)) {
      ls()?.setItem(STORAGE_ANALYTICS, JSON.stringify(data.analytics.slice(-500)))
    }
  }
  return true
}
