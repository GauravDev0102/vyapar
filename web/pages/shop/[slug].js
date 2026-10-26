import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Store, Phone, MessageCircle, MapPin, Clock, Search } from 'lucide-react'
import { loadShop, loadProducts, loadLeads, saveLeads, loadLeadStatuses, saveLeadStatuses, newLeadId } from '@/lib/store'
import { analytics } from '@/lib/analytics'

const CATEGORY_PRESETS = [
  { id: 'general', icon: '📦', name: { en: 'General', hi: 'सामान्य' } },
  { id: 'groceries', icon: '🛒', name: { en: 'Groceries', hi: 'किराना' } },
  { id: 'electronics', icon: '🔌', name: { en: 'Electronics', hi: 'इलेक्ट्रॉनिक्स' } },
  { id: 'clothing', icon: '👕', name: { en: 'Clothing', hi: 'कपड़े' } },
  { id: 'hardware', icon: '🔧', name: { en: 'Hardware', hi: 'हार्डवेयर' } },
  { id: 'furniture', icon: '🪑', name: { en: 'Furniture', hi: 'फर्नीचर' } },
  { id: 'medical', icon: '💊', name: { en: 'Medical Store', hi: 'मेडिकल स्टोर' } },
  { id: 'bakery', icon: '🥖', name: { en: 'Bakery', hi: 'बेकरी' } },
]

export default function ShopPage() {
  const router = useRouter()
  const { slug } = router.query
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [lang, setLang] = useState('en')
  const [filterCat, setFilterCat] = useState('all')
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    const s = loadShop()
    if (s && s.slug === slug) {
      setShop(s)
      setProducts(loadProducts())
    }
    analytics.trackShopVisit(slug)
  }, [slug])

  useEffect(() => {
    setLang(localStorage.getItem('vyapar_lang') || 'en')
    document.documentElement.classList.toggle('dark', localStorage.getItem('vyapar_dark') === 'true')
  }, [])

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500">
            {lang === 'en' ? 'Shop not found' : 'दुकान नहीं मिली'}
          </h2>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-2">
            {lang === 'en' ? 'This shop has not been set up yet.' : 'यह दुकान अभी सेटअप नहीं हुई है।'}
          </p>
        </div>
      </div>
    )
  }

  const categories = shop.categories?.length ? shop.categories : CATEGORY_PRESETS
  const filtered = products.filter(p => {
    const mCat = filterCat === 'all' || p.cat === filterCat
    const mSearch = !searchQ ||
      p.name.en.toLowerCase().includes(searchQ) ||
      (p.name.hi || '').includes(searchQ)
    return mCat && mSearch
  })
  const whatsappNum = shop.whatsapp?.replace(/[^0-9]/g, '')

  function trackLead(productName) {
    const leads = loadLeads()
    const statuses = loadLeadStatuses()
    const lead = {
      id: newLeadId(leads.length),
      name: 'Website Visitor',
      phone: shop.whatsapp || 'N/A',
      msg: `Interested in: ${productName}`,
      product: productName,
      date: new Date().toISOString(),
    }
    const updated = [...leads, lead]
    saveLeads(updated)
    statuses[lead.id] = 'not'
    saveLeadStatuses(statuses)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{shop?.name?.en ? `${shop.name.en} — Order Online | Vyapar` : 'Vyapar'}</title>
        {shop?.name?.en && (
          <meta name="description" content={`Order online from ${shop.name.en}${shop.address?.en ? ` — ${shop.address.en}` : ''} via WhatsApp. ${products.length} products available.`} />
        )}
      </Head>
      <div className="bg-primary-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center">
            <div className="text-4xl mb-2">{shop.logo || '🏪'}</div>
            <h1 className="text-2xl font-extrabold">{shop.name?.[lang] || shop.name?.en}</h1>
            <div className="flex items-center justify-center gap-1 text-sm text-white/70 mt-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{shop.address?.[lang] || shop.address?.en}</span>
            </div>
            {shop.hours && (
              <div className="flex items-center justify-center gap-1 text-sm text-white/60 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{shop.hours}</span>
              </div>
            )}
            <div className="flex justify-center gap-3 mt-5">
              {shop.phone && (
                <a href={`tel:${shop.phone}`}
                  className="flex items-center gap-1.5 bg-accent-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-500 transition-all shadow-lg shadow-accent-400/30">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
              {whatsappNum && (
                <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noopener noreferrer" onClick={() => analytics.trackWhatsAppClick(slug)}
                  className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
          {(shop.categories?.length > 1) && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setFilterCat(c.id === filterCat ? 'all' : c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterCat === c.id ? 'bg-white text-primary-700' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {c.icon} {c.name[lang]}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search products...' : 'उत्पाद खोजें...'}
              value={searchQ}
              onChange={e => setSearchQ(e.target.value.toLowerCase())}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/20"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 dark:text-gray-400">{lang === 'en' ? 'No products found' : 'कोई उत्पाद नहीं मिला'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                {p.image && (
                  <img src={p.image} alt={p.name.en} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{p.name[lang]}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{p.desc[lang]}</p>
                    </div>
                    <span className="font-bold text-primary-600 whitespace-nowrap">₹{p.price}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {whatsappNum && (
                      <a
                        href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi ${shop.name?.en || ''}, I want to order: ${p.name.en} (₹${p.price})`)}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={() => { analytics.trackWhatsAppClick(slug); trackLead(p.name.en); }}
                        className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-600 transition-all"
                      >
                        💬 {lang === 'en' ? 'Order' : 'ऑर्डर'}
                      </a>
                    )}
                    {whatsappNum && (
                      <a
                        href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi ${shop.name?.en || ''}, what is the price of: ${p.name.en}?`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        💰 {lang === 'en' ? 'Price' : 'मूल्य'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {whatsappNum && (
        <a
          href={`https://wa.me/${whatsappNum}`}
          target="_blank" rel="noopener noreferrer"
          onClick={() => analytics.trackWhatsAppClick(slug)}
          className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-xl shadow-green-500/40 flex items-center justify-center hover:bg-green-600 transition-all hover:scale-105 z-50"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      )}
    </div>
  )
}
