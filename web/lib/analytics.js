// Local analytics — events are stored in the browser via localStorage.
// No server needed; data never leaves the device (better for privacy).
const STORAGE_KEY = 'vyapar_analytics'
const MAX_EVENTS = 500

function readEvents() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function writeEvents(events) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (e) {
    console.error('Analytics Error:', e)
  }
}

export function track(type, { shopId, productId } = {}) {
  if (typeof window === 'undefined') return
  const events = readEvents()
  events.push({
    type,
    shopId: shopId || null,
    productId: productId || null,
    ts: Date.now(),
  })
  writeEvents(events.slice(-MAX_EVENTS))
}

export function trackShopVisit(shopId) {
  if (typeof window === 'undefined') return
  // Count each visit once per browser session
  const sessionKey = `vyapar_visit_${shopId}`
  if (window.sessionStorage.getItem(sessionKey)) return
  try { window.sessionStorage.setItem(sessionKey, '1') } catch {}
  track('shop_visit', { shopId })
}

export function trackWhatsAppClick(shopId) {
  track('whatsapp_click', { shopId })
}

export function trackProductView(shopId, productId) {
  track('product_view', { shopId, productId })
}

export function trackConversion(shopId, leadId) {
  track('conversion', { shopId, leadId })
}

// Replaces stored events with a prepared list (used by the demo-data loader).
export function seedAnalytics(events) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
  } catch (e) {
    console.error('Analytics Error:', e)
  }
}

export function getAnalytics(type, shopId, startDate, endDate) {
  if (typeof window === 'undefined') return []
  const start = startDate ? new Date(startDate).getTime() : null
  const end = endDate ? new Date(endDate).getTime() : null
  return readEvents().filter(e => {
    if (type && e.type !== type) return false
    if (shopId && e.shopId !== shopId) return false
    if (start && e.ts < start) return false
    if (end && e.ts > end) return false
    return true
  })
}

export const analytics = {
  track,
  trackShopVisit,
  trackWhatsAppClick,
  trackProductView,
  trackConversion,
  getAnalytics,
  seedAnalytics,
}

export default analytics
