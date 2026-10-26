// Generates a realistic one-click demo dataset so the dashboard can be
// showcased (or first-run tested) without typing anything in by hand.
import { generateSlug, newLeadId } from '@/lib/store'

const DAY = 24 * 60 * 60 * 1000

export function buildDemoData(now = Date.now()) {
  const id = () => newLeadId(0) + Math.random().toString(36).slice(2, 6)

  const shop = {
    name: { en: 'Kiran Stores', hi: 'किरण स्टोर्स' },
    phone: '919876543210',
    whatsapp: '919876543210',
    address: { en: '12 Market Road, Pune', hi: '12 मार्केट रोड, पुणे' },
    hours: 'Mon-Sat 9AM-9PM',
    logo: '🏪',
    slug: generateSlug('Kiran Stores'),
    categories: [
      { id: 'groceries', icon: '🛒', name: { en: 'Groceries', hi: 'किराना' } },
      { id: 'electronics', icon: '🔌', name: { en: 'Electronics', hi: 'इलेक्ट्रॉनिक्स' } },
      { id: 'clothing', icon: '👕', name: { en: 'Clothing', hi: 'कपड़े' } },
      { id: 'bakery', icon: '🥖', name: { en: 'Bakery', hi: 'बेकरी' } },
    ],
    createdAt: new Date(now - 30 * DAY).toISOString(),
  }

  const products = [
    { id: 'p1', name: { en: 'Basmati Rice 5kg', hi: 'बासमती चावल 5 किलो' }, desc: { en: 'Premium aged long-grain basmati rice from Karnal.', hi: 'करनाल के प्रीमियम वृद्ध लंबे बासमती चावल।' }, price: 420, cat: 'groceries', image: '', stock: 24 },
    { id: 'p2', name: { en: 'Sunflower Oil 1L', hi: 'सूरजमुखी तेल 1 लीटर' }, desc: { en: 'Refined sunflower oil, ideal for everyday cooking.', hi: 'शुद्ध सूरजमुखी तेल, रोज़ाना खाने के लिए।' }, price: 185, cat: 'groceries', image: '', stock: 8 },
    { id: 'p3', name: { en: 'LED Bulb 9W', hi: 'एलईडी बल्ब 9 वॉट' }, desc: { en: 'Cool-white LED bulb with 1-year warranty.', hi: '1 साल की वारंटी वाला एलईडी बल्ब।' }, price: 95, cat: 'electronics', image: '', stock: 40 },
    { id: 'p4', name: { en: 'Cotton T-Shirt', hi: 'सूती टी-शर्ट' }, desc: { en: '100% cotton, breathable, sizes S-XL.', hi: '100% सूती, हवादार, साइज़ S-XL।' }, price: 299, cat: 'clothing', image: '', stock: 0 },
    { id: 'p5', name: { en: 'Choco Muffins (Pack of 6)', hi: 'चोको मफिन (6 का पैक)' }, desc: { en: 'Soft baked chocolate muffins, eggless.', hi: 'सॉफ्ट बेक्ड चॉकलेट मफिन, अंड-लेस।' }, price: 149, cat: 'bakery', image: '', stock: 12 },
    { id: 'p6', name: { en: 'Brown Bread 400g', hi: 'ब्राउन ब्रेड 400 ग्राम' }, desc: { en: 'Freshly baked daily, whole wheat.', hi: 'रोज़ ताज़ा बेक्ड, गेहूं का।' }, price: 45, cat: 'bakery', image: '', stock: 15 },
  ]

  const nowIso = ts => new Date(ts).toISOString()
  const leads = [
    { id: 'l1', name: 'Ramesh Patil', phone: '919876500011', msg: '', product: '', source: 'walk-in', followUp: '', notes: 'Regular customer', value: 420, date: nowIso(now - 6 * DAY) },
    { id: 'l2', name: 'Priya Sharma', phone: '919876500012', msg: 'Interested in: LED Bulb 9W', product: 'LED Bulb 9W', source: 'website', followUp: new Date(now + 2 * DAY).toISOString().slice(0, 10), notes: '', value: 0, date: nowIso(now - 2 * DAY) },
    { id: 'l3', name: 'Amit Verma', phone: '919876500013', msg: '', product: 'Choco Muffins (Pack of 6)', source: 'referral', followUp: '', notes: 'Referred by Ramesh', value: 0, date: nowIso(now - DAY) },
    { id: 'l4', name: 'Sunita Devi', phone: '919876500014', msg: '', product: 'Brown Bread 400g', source: 'whatsapp', followUp: new Date(now + DAY).toISOString().slice(0, 10), notes: '', value: 0, date: nowIso(now - DAY) },
    { id: 'l5', name: 'Website Visitor', phone: '919876543210', msg: 'Interested in: Cotton T-Shirt', product: 'Cotton T-Shirt', source: '', followUp: '', notes: '', value: 0, date: nowIso(now - 2 * 3600 * 1000) },
  ]
  const leadStatuses = { l1: 'cli', l2: 'int', l3: 'not', l4: 'mtg', l5: 'not' }

  const ev = (type, ts, product = null) => ({ type, shopId: shop.slug, productId: product, ts })
  const analytics = [
    ev('shop_visit', now - 6 * DAY), ev('shop_visit', now - 5 * DAY), ev('shop_visit', now - 4 * DAY),
    ev('whatsapp_click', now - 4 * DAY, 'p1'), ev('whatsapp_click', now - 3 * DAY, 'p6'),
    ev('product_view', now - 3 * DAY, 'p1'), ev('product_view', now - 3 * DAY, 'p3'), ev('product_view', now - 2 * DAY, 'p4'),
    ev('shop_visit', now - 2 * DAY), ev('conversion', now - 2 * DAY),
    ev('shop_visit', now - DAY), ev('whatsapp_click', now - DAY, 'p6'), ev('shop_visit', now - 4 * 3600 * 1000),
  ]

  return { shop, products, leads, leadStatuses, analytics }
}
