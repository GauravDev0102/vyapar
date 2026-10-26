// Local description autofill — fills a clean bilingual description from the
// product's name, category and price. No API key or server required.

const CATEGORY_NAMES = {
  general: { en: 'our shop', hi: 'हमारी दुकान' },
  groceries: { en: 'groceries section', hi: 'किराना सेक्शन' },
  electronics: { en: 'electronics section', hi: 'इलेक्ट्रॉनिक्स सेक्शन' },
  clothing: { en: 'clothing section', hi: 'कपड़ों का सेक्शन' },
  hardware: { en: 'hardware section', hi: 'हार्डवेयर सेक्शन' },
  furniture: { en: 'furniture section', hi: 'फर्नीचर सेक्शन' },
  medical: { en: 'medical counter', hi: 'मेडिकल काउंटर' },
  bakery: { en: 'bakery counter', hi: 'बेकरी काउंटर' },
}

export function generateLocalDescription({ name, category, price }) {
  const enName = name || 'This product'
  const catName = CATEGORY_NAMES[category] || CATEGORY_NAMES.general

  const priceEn = price ? `Price: ₹${price}.` : 'Ask us for the latest price.'
  const en = `${enName} is available in ${catName.en} — fresh stock and good quality. ${priceEn} Message us on WhatsApp or visit the shop to order.`

  const priceHi = price ? `मूल्य: ₹${price}.` : 'नवीनतम मूल्य जानने के लिए संपर्क करें।'
  const hi = `${enName} ${catName.hi} में उपलब्ध है — ताज़ा स्टॉक और अच्छी गुणवत्ता। ${priceHi} ऑर्डर के लिए व्हाट्सएप पर संदेश करें या दुकान पर आएं।`

  return { en, hi }
}
