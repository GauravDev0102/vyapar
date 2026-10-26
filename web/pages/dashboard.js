import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Store, Package, Globe, Users, Settings, Copy, ExternalLink, Plus, X, Search, QrCode, Wand2 } from 'lucide-react'
import { loadShop, saveShop, loadProducts, saveProducts, loadLeads, saveLeads, loadLeadStatuses, saveLeadStatuses, clearAllData, generateSlug, exportAllData, importAllData, normalizeLeads, newLeadId } from '@/lib/store'
import { buildDemoData } from '@/lib/demo-data'
import { generateQRCode } from '@/lib/qr-client'
import { analytics } from '@/lib/analytics'
import { generateLocalDescription } from '@/lib/description'

const LANG = {
  en: {
    dashboard: 'Dashboard', shopSetup: 'Shop Setup', products: 'Products',
    website: 'Website', crm: 'Leads & CRM',
    save: 'Save', saved: 'Saved!', addProduct: 'Add Product',
    shopName: 'Shop Name', shopNameHi: 'Shop Name (Hindi)',
    phone: 'Phone', whatsapp: 'WhatsApp', address: 'Address',
    addressHi: 'Address (Hindi)', hours: 'Business Hours',
    productName: 'Product Name', productNameHi: 'Product Name (Hindi)',
    productDesc: 'Description', productDescHi: 'Description (Hindi)',
    price: 'Price (₹)', category: 'Category', photo: 'Photo URL',
    preview: 'Preview', visitSite: 'Visit Site', copyLink: 'Copy Link',
    noProducts: 'No products yet. Add your first product!',
    noLeads: 'No leads yet. Share your shop link!',
    orderOnWA: 'Order on WhatsApp', needPrice: 'Get Price',
    search: 'Search products...', allProducts: 'All Products',
    langToggle: 'Hindi', shopLinkCopied: 'Link copied!',
    customers: 'Customers', revenue: 'Revenue', products_: 'Products',
    not: 'Not Contacted', int: 'Interested', mtg: 'Meeting', cli: 'Closed',
    'walk-in': 'Walk-in', referral: 'Referral',
    notes: 'Notes', followUp: 'Follow-up', archive: 'Archive', delete: 'Delete',
    status: 'Status', total: 'Total', active: 'Active',
    exportData: 'Export Data', importData: 'Import Data',
    exportDone: 'Exported!', importDone: 'Imported!',
    importConfirm: 'This will overwrite your current data. Continue?',
    dataManagement: 'Data Management',
    dataNote: 'Export your shop data as a JSON file to backup or transfer to another device.',
    clearData: 'Clear All Data', dataCleared: 'Cleared!',
    clearConfirm: 'This will permanently delete all shop, product, lead and analytics data from this browser. Continue?',
    demoData: 'Load Demo Data', demoDone: 'Demo loaded!',
    demoConfirm: 'Loading demo data will replace your current data in this browser. Continue?',
    qrCodes: 'QR Codes', shopQR: 'Shop QR', whatsappQR: 'WhatsApp QR', reviewQR: 'Review QR',
    scanShop: 'Scan to visit shop', scanWhatsApp: 'Scan to chat on WhatsApp', scanReview: 'Scan to send feedback',
    autoDesc: 'Auto-fill Description',
    stockLabel: 'Stock Quantity', stock: 'Stock', stockUnit: 'units', stockUnitOne: 'unit',
    outOfStock: 'Out of Stock', lowStock: 'Low Stock',
    leadName: 'Lead Name', leadSource: 'Lead Source', leadValue: 'Deal Value (₹)',
    visits: 'Website Visits', waClicks: 'WhatsApp Clicks', prodViews: 'Product Views', conversions: 'Conversions',
    customer: 'Customer', purchases: 'Purchases',
  },
  hi: {
    dashboard: 'डैशबोर्ड', shopSetup: 'दुकान सेटअप', products: 'उत्पाद',
    website: 'वेबसाइट', crm: 'लीड्स और CRM',
    save: 'सहेजें', saved: 'सहेजा गया!', addProduct: 'उत्पाद जोड़ें',
    shopName: 'दुकान का नाम', shopNameHi: 'दुकान का नाम (हिंदी)',
    phone: 'फ़ोन', whatsapp: 'व्हाट्सएप', address: 'पता',
    addressHi: 'पता (हिंदी)', hours: 'व्यावसायिक समय',
    productName: 'उत्पाद का नाम', productNameHi: 'उत्पाद का नाम (हिंदी)',
    productDesc: 'विवरण', productDescHi: 'विवरण (हिंदी)',
    price: 'मूल्य (₹)', category: 'श्रेणी', photo: 'फ़ोटो URL',
    preview: 'प्रीव्यू', visitSite: 'दुकान देखें', copyLink: 'लिंक कॉपी करें',
    noProducts: 'अभी कोई उत्पाद नहीं। पहला उत्पाद जोड़ें!',
    noLeads: 'अभी कोई लीड नहीं। अपना लिंक शेयर करें!',
    orderOnWA: 'व्हाट्सएप पर ऑर्डर करें', needPrice: 'मूल्य जानें',
    search: 'उत्पाद खोजें...', allProducts: 'सभी उत्पाद',
    langToggle: 'English', shopLinkCopied: 'लिंक कॉपी हो गया!',
    customers: 'ग्राहक', revenue: 'आय', products_: 'उत्पाद',
    not: 'संपर्क नहीं', int: 'रुचि', mtg: 'मीटिंग', cli: 'बंद',
    'walk-in': 'सीधे आए', referral: 'रेफ़रल',
    notes: 'नोट्स', followUp: 'फॉलो-अप', archive: 'आर्काइव', delete: 'हटाएं',
    status: 'स्थिति', total: 'कुल', active: 'सक्रिय',
    exportData: 'डेटा निर्यात', importData: 'डेटा आयात',
    exportDone: 'निर्यात हुआ!', importDone: 'आयात हुआ!',
    importConfirm: 'यह आपके मौजूदा डेटा को बदल देगा। जारी रखें?',
    dataManagement: 'डेटा प्रबंधन',
    dataNote: 'बैकअप या दूसरे डिवाइस पर ट्रांसफर के लिए अपना डेटा JSON फ़ाइल में निर्यात करें।',
    clearData: 'सारा डेटा मिटाएं', dataCleared: 'मिट गया!',
    clearConfirm: 'इससे इस ब्राउज़र का सारा दुकान, उत्पाद, लीड और एनालिटिक्स डेटा स्थायी रूप से मिट जाएगा। जारी रखें?',
    demoData: 'डेमो डेटा लोड करें', demoDone: 'डेमो लोड हुआ!',
    demoConfirm: 'डेमो डेटा लोड करने से इस ब्राउज़र का मौजूदा डेटा बदल जाएगा। जारी रखें?',
    qrCodes: 'QR कोड', shopQR: 'दुकान QR', whatsappQR: 'व्हाट्सएप QR', reviewQR: 'रिव्यू QR',
    scanShop: 'दुकान देखने के लिए स्कैन करें', scanWhatsApp: 'व्हाट्सएप पर चैट के लिए स्कैन करें', scanReview: 'फ़ीडबैक भेजने के लिए स्कैन करें',
    autoDesc: 'विवरण अपने-आप भरें',
    stockLabel: 'स्टॉक मात्रा', stock: 'स्टॉक', stockUnit: 'यूनिट', stockUnitOne: 'यूनिट',
    outOfStock: 'स्टॉक समाप्त', lowStock: 'कम स्टॉक',
    leadName: 'लीड नाम', leadSource: 'लीड स्रोत', leadValue: 'डील मूल्य (₹)',
    visits: 'वेबसाइट विज़िट', waClicks: 'व्हाट्सएप क्लिक', prodViews: 'प्रोडक्ट व्यूज़', conversions: 'कन्वर्सन्स',
    customer: 'ग्राहक', purchases: 'ख़रीदारी',
  }
}

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

const STATUS_KEYS = ['not', 'int', 'mtg', 'cli']
const STATUS_ICONS = { not: '🔴', int: '🟢', mtg: '🔵', cli: '💰' }
const LEAD_SOURCES = ['website', 'whatsapp', 'walk-in', 'referral']
const LEAD_SOURCE_ICONS = { website: '🌐', whatsapp: '💬', 'walk-in': '🚶', referral: '🔗' }

function t(lang, key) { return LANG[lang][key] || key }

export default function Dashboard() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('setup')
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [leads, setLeads] = useState([])
  const [leadStatuses, setLeadStatuses] = useState({})
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({ nameEn: '', nameHi: '', phone: '', whatsapp: '', addressEn: '', addressHi: '', hours: '', categories: [] })
  const [prodForm, setProdForm] = useState({ nameEn: '', nameHi: '', descEn: '', descHi: '', price: '', cat: 'general', image: '', stock: 0 })
  const [searchQ, setSearchQ] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [copied, setCopied] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [dark, setDark] = useState(false)
  const [qrCodes, setQrCodes] = useState({})
  const [generatingQR, setGeneratingQR] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({})
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

  useEffect(() => {
    const d = localStorage.getItem('vyapar_dark') === 'true'
    setDark(d)
    document.documentElement.classList.toggle('dark', d)
  }, [])

  useEffect(() => {
    const l = localStorage.getItem('vyapar_lang') || 'en'
    setLang(l)
    setShop(loadShop())
    setProducts(loadProducts())
    const { leads, statuses } = normalizeLeads()
    setLeads(leads)
    setLeadStatuses(statuses)
  }, [])

  useEffect(() => {
    if (shop) {
      setForm({
        nameEn: shop.name?.en || '',
        nameHi: shop.name?.hi || '',
        phone: shop.phone || '',
        whatsapp: shop.whatsapp || '',
        addressEn: shop.address?.en || '',
        addressHi: shop.address?.hi || '',
        hours: shop.hours || '',
        categories: shop.categories || [],
      })
    }
  }, [shop])

  async function handleExport() {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vyapar-${shop?.slug || 'shop'}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setImportStatus('exported')
    setTimeout(() => setImportStatus(''), 2000)
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!confirm(t(lang, 'importConfirm'))) { e.target.value = ''; return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (importAllData(data)) {
          setShop(loadShop())
          setProducts(loadProducts())
          const { leads, statuses } = normalizeLeads()
          setLeads(leads)
          setLeadStatuses(statuses)
          setImportStatus('imported')
          setTimeout(() => setImportStatus(''), 2000)
        } else {
          alert('Invalid data file')
        }
      } catch { alert('Invalid file format') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleClearData() {
    if (!confirm(t(lang, 'clearConfirm'))) return
    clearAllData()
    setShop(null)
    setProducts([])
    setLeads([])
    setLeadStatuses({})
    setQrCodes({})
    setAnalyticsData({})
    setImportStatus('cleared')
    setTimeout(() => setImportStatus(''), 2000)
  }

  function handleLoadDemo() {
    if (!confirm(t(lang, 'demoConfirm'))) return
    const demo = buildDemoData()
    clearAllData()
    saveShop(demo.shop)
    saveProducts(demo.products)
    saveLeads(demo.leads)
    saveLeadStatuses(demo.leadStatuses)
    analytics.seedAnalytics(demo.analytics)
    setShop(demo.shop)
    setProducts(demo.products)
    setLeads(demo.leads)
    setLeadStatuses(demo.leadStatuses)
    setImportStatus('demo')
    setTimeout(() => setImportStatus(''), 2000)
  }

  async function handleSaveShop() {
    const data = {
      ...shop,
      name: { en: form.nameEn, hi: form.nameHi || form.nameEn },
      phone: form.phone,
      whatsapp: form.whatsapp,
      address: { en: form.addressEn, hi: form.addressHi || form.addressEn },
      hours: form.hours,
      categories: form.categories.length ? form.categories : [CATEGORY_PRESETS[0]],
      slug: shop?.slug || generateSlug(form.nameEn),
    }
    saveShop(data)
    setShop(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleAddProduct() {
    if (!prodForm.nameEn) return
    const p = {
      id: Date.now(),
      name: { en: prodForm.nameEn, hi: prodForm.nameHi || prodForm.nameEn },
      desc: { en: prodForm.descEn, hi: prodForm.descHi || prodForm.descEn },
      price: parseFloat(prodForm.price) || 0,
      cat: prodForm.cat,
      image: prodForm.image,
      stock: parseInt(prodForm.stock) || 0,
    }
    const updated = [...products, p]
    setProducts(updated)
    saveProducts(updated)
    setProdForm({ nameEn: '', nameHi: '', descEn: '', descHi: '', price: '', cat: 'general', image: '', stock: 0 })
    setShowAdd(false)
  }

  async function handleDeleteProduct(id) {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveProducts(updated)
  }

  function handleDeleteLead(id) {
    const updated = leads.filter(l => l.id !== id)
    const newStatuses = { ...leadStatuses }
    delete newStatuses[id]
    setLeads(updated)
    setLeadStatuses(newStatuses)
    saveLeads(updated)
    saveLeadStatuses(newStatuses)
  }

  function setLeadStatus(id, status) {
    const updated = { ...leadStatuses, [id]: status }
    setLeadStatuses(updated)
    saveLeadStatuses(updated)
  }

  function addLeadFromForm(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const lead = {
      id: newLeadId(leads.length),
      name: fd.get('leadName'),
      phone: fd.get('leadPhone'),
      msg: '',
      product: '',
      source: fd.get('leadSource') || '',
      followUp: fd.get('leadFollowUp') || '',
      notes: fd.get('leadNotes') || '',
      value: parseFloat(fd.get('leadValue')) || 0,
      date: new Date().toISOString(),
    }
    if (!lead.name || !lead.phone) return
    const updated = [...leads, lead]
    const s = { ...leadStatuses, [lead.id]: 'not' }
    setLeads(updated)
    setLeadStatuses(s)
    saveLeads(updated)
    saveLeadStatuses(s)
    e.target.reset()
  }

  function getStatus(id) { return leadStatuses[id] !== undefined ? leadStatuses[id] : 'not' }

  const filteredProducts = products.filter(p => {
    const mCat = filterCat === 'all' || p.cat === filterCat
    const mSearch = !searchQ ||
      p.name.en.toLowerCase().includes(searchQ) ||
      (p.name.hi || '').includes(searchQ)
    return mCat && mSearch
  })

  const activeLeads = leads.filter(l => leadStatuses[l.id] !== 'cli')

  const totalRevenue = leads.reduce((sum, l) => {
    return sum + (leadStatuses[l.id] === 'cli' ? (l.value || 0) : 0)
  }, 0)

  const tabs = [
    { id: 'setup', icon: Settings, label: t(lang, 'shopSetup') },
    { id: 'products', icon: Package, label: t(lang, 'products') },
    { id: 'website', icon: Globe, label: t(lang, 'website') },
    { id: 'crm', icon: Users, label: t(lang, 'crm') },
  ]

  const shopUrl = shop?.slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/shop/${shop.slug}` : ''

  const generateAllQRs = async () => {
    if (!shop) return;
    setGeneratingQR(true);
    try {
      const shopQR = await generateQRCode('shop', shop.slug);
      const whatsappQR = await generateQRCode('whatsapp', shop.whatsapp || shop.phone);
      const reviewQR = await generateQRCode('review', {
        phone: shop.whatsapp || shop.phone,
        shop: shop.name?.en || shop.slug,
      });

      setQrCodes({
        shop: shopQR,
        whatsapp: whatsappQR,
        review: reviewQR,
      });
    } catch (error) {
      console.error('Error generating QR codes:', error);
    } finally {
      setGeneratingQR(false);
    }
  };

  const loadAnalytics = async () => {
    if (!shop) return;
    setLoadingAnalytics(true);
    try {
      const [shopVisits, whatsappClicks, productViews, conversions] = await Promise.all([
        analytics.getAnalytics('shop_visit', shop.slug),
        analytics.getAnalytics('whatsapp_click', shop.slug),
        analytics.getAnalytics('product_view', shop.slug),
        analytics.getAnalytics('conversion', shop.slug),
      ]);
      
      setAnalyticsData({
        shopVisits: shopVisits.length,
        whatsappClicks: whatsappClicks.length,
        productViews: productViews.length,
        conversions: conversions.length,
        conversionRate: shopVisits.length > 0 ? (conversions.length / shopVisits.length * 100).toFixed(1) : 0,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (shop) {
      generateAllQRs();
      loadAnalytics();
    }
  }, [shop]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{t(lang, 'dashboard')} — Vyapar</title>
        <meta name="robots" content="noindex" />
      </Head>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              aria-label="Go to homepage"
              title="Go to homepage"
              className="flex items-center gap-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 rounded-lg"
            >
              <Store className="w-5 h-5 text-primary-600 group-hover:text-primary-300 transition-colors" />
              <span className="font-bold text-primary-600 group-hover:text-primary-300 transition-colors">Vyapar</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { const d = !dark; setDark(d); localStorage.setItem('vyapar_dark', d); document.documentElement.classList.toggle('dark', d) }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => { const l = lang === 'en' ? 'hi' : 'en'; setLang(l); localStorage.setItem('vyapar_lang', l) }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t(lang, 'langToggle')}
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'setup' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t(lang, 'shopSetup')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={t(lang, 'shopName')} val={form.nameEn} onChange={v => setForm(f => ({ ...f, nameEn: v }))} />
              <Input label={t(lang, 'shopNameHi')} val={form.nameHi} onChange={v => setForm(f => ({ ...f, nameHi: v }))} />
              <Input label={t(lang, 'phone')} val={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} type="tel" />
              <Input label={t(lang, 'whatsapp')} val={form.whatsapp} onChange={v => setForm(f => ({ ...f, whatsapp: v }))} type="tel" />
              <div className="md:col-span-2">
                <Input label={t(lang, 'address')} val={form.addressEn} onChange={v => setForm(f => ({ ...f, addressEn: v }))} />
              </div>
              <div className="md:col-span-2">
                <Input label={t(lang, 'addressHi')} val={form.addressHi} onChange={v => setForm(f => ({ ...f, addressHi: v }))} />
              </div>
              <Input label={t(lang, 'hours')} val={form.hours} onChange={v => setForm(f => ({ ...f, hours: v }))} placeholder="e.g. Mon-Sat 9AM-8PM" />
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t(lang, 'category')}</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_PRESETS.map(c => {
                    const sel = form.categories.some(x => x.id === c.id)
                    return (
                      <button
                        key={c.id}
                        onClick={() => setForm(f => ({
                          ...f,
                          categories: sel ? f.categories.filter(x => x.id !== c.id) : [...f.categories, c]
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          sel ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {c.icon} {c.name[lang]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveShop}
              className="mt-6 bg-accent-400 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent-500 transition-all shadow-lg shadow-accent-400/20"
            >
              {saved ? `✓ ${t(lang, 'saved')}` : t(lang, 'save')}
            </button>

            {shop && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{t(lang, 'qrCodes')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {shopUrl && (
                    <div className="text-center">
                      <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-2">{t(lang, 'shopQR')}</h4>
                        {qrCodes.shop ? (
                          <img src={qrCodes.shop.qrCode} alt="Shop QR Code" className="w-32 h-32 mx-auto" />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto">
                            {generatingQR ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            ) : (
                              <QrCode className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t(lang, 'scanShop')}</p>
                      </div>
                    </div>
                  )}
                  {shop.whatsapp || shop.phone ? (
                    <div className="text-center">
                      <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-2">{t(lang, 'whatsappQR')}</h4>
                        {qrCodes.whatsapp ? (
                          <img src={qrCodes.whatsapp.qrCode} alt="WhatsApp QR Code" className="w-32 h-32 mx-auto" />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto">
                            {generatingQR ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            ) : (
                              <QrCode className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t(lang, 'scanWhatsApp')}</p>
                      </div>
                    </div>
                  ) : null}
                  {shop.slug ? (
                    <div className="text-center">
                      <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600">
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-2">{t(lang, 'reviewQR')}</h4>
                        {qrCodes.review ? (
                          <img src={qrCodes.review.qrCode} alt="Review QR Code" className="w-32 h-32 mx-auto" />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto">
                            {generatingQR ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            ) : (
                              <QrCode className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t(lang, 'scanReview')}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{t(lang, 'dataManagement')}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{t(lang, 'dataNote')}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {importStatus === 'exported' ? '✅ ' : '📥 '}
                  {importStatus === 'exported' ? t(lang, 'exportDone') : t(lang, 'exportData')}
                </button>
                <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer">
                  {importStatus === 'imported' ? '✅ ' : '📤 '}
                  {importStatus === 'imported' ? t(lang, 'importDone') : t(lang, 'importData')}
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-all"
                >
                  {importStatus === 'cleared' ? '🧹 ' : '♻️ '}
                  {importStatus === 'cleared' ? t(lang, 'dataCleared') : t(lang, 'clearData')}
                </button>
                <button
                  onClick={handleLoadDemo}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-all"
                >
                  {importStatus === 'demo' ? '🎬 ' : '🎛️ '}
                  {importStatus === 'demo' ? t(lang, 'demoDone') : t(lang, 'demoData')}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t(lang, 'products')} ({products.length})</h2>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-500 transition-all flex items-center gap-1.5"
              >
                {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAdd ? t(lang, 'save') : t(lang, 'addProduct')}
              </button>
            </div>

            {showAdd && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{t(lang, 'addProduct')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label={t(lang, 'productName')} val={prodForm.nameEn} onChange={v => setProdForm(f => ({ ...f, nameEn: v }))} />
                  <Input label={t(lang, 'productNameHi')} val={prodForm.nameHi} onChange={v => setProdForm(f => ({ ...f, nameHi: v }))} />
                  <Input label={t(lang, 'productDesc')} val={prodForm.descEn} onChange={v => setProdForm(f => ({ ...f, descEn: v }))} />
                  <Input label={t(lang, 'productDescHi')} val={prodForm.descHi} onChange={v => setProdForm(f => ({ ...f, descHi: v }))} />
                  <Input label={t(lang, 'price')} val={prodForm.price} onChange={v => setProdForm(f => ({ ...f, price: v }))} type="number" />
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t(lang, 'category')}</label>
                    <select
                      value={prodForm.cat}
                      onChange={e => setProdForm(f => ({ ...f, cat: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    >
                      {(shop?.categories?.length ? shop.categories : CATEGORY_PRESETS).map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name[lang]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Input label={t(lang, 'photo')} val={prodForm.image} onChange={v => setProdForm(f => ({ ...f, image: v }))} placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t(lang, 'stockLabel')}</label>
                    <input
                      type="number"
                      value={prodForm.stock}
                      onChange={e => setProdForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{t(lang, 'productDesc')}</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!prodForm.nameEn) return;
                        const result = generateLocalDescription({ name: prodForm.nameEn, category: prodForm.cat, price: prodForm.price });
                        setProdForm(f => ({ ...f, descEn: result.en, descHi: result.hi }));
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all"
                    >
                      <Wand2 className="w-4 h-4" />
                      {t(lang, 'autoDesc')}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddProduct}
                  className="mt-4 bg-accent-400 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent-500 transition-all"
                >
                  {t(lang, 'addProduct')}
                </button>
              </div>
            )}

            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder={t(lang, 'search')}
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value.toLowerCase())}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                />
              </div>
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              >
                <option value="all">{t(lang, 'allProducts')}</option>
                {(shop?.categories?.length ? shop.categories : CATEGORY_PRESETS).map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name[lang]}</option>
                ))}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700">
                {t(lang, 'noProducts')}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    {p.image && (
                      <img src={p.image} alt={p.name.en} className="w-full h-32 object-cover rounded-xl mb-3" />
                    )}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{p.name[lang]}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.name[lang === 'en' ? 'hi' : 'en']}</p>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{p.desc[lang]}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-bold text-primary-600">₹{p.price}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {CATEGORY_PRESETS.find(c => c.id === p.cat)?.icon}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t(lang, 'stock')}:</span>
                        <span className={`text-xs font-medium ${p.stock === 0 ? 'text-red-600 dark:text-red-400' : p.stock < 10 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                          {p.stock} {p.stock === 1 ? t(lang, 'stockUnitOne') : t(lang, 'stockUnit')}
                        </span>
                      </div>
                      {p.stock === 0 && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                          🚫 {t(lang, 'outOfStock')}
                        </div>
                      )}
                      {p.stock > 0 && p.stock < 10 && (
                        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                          ⚠️ {t(lang, 'lowStock')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'website' && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t(lang, 'website')}</h2>
                <div className="flex gap-2">
                  {shopUrl && (
                    <>
                      <button
                        onClick={() => { navigator.clipboard.writeText(shopUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? t(lang, 'shopLinkCopied') : t(lang, 'copyLink')}
                      </button>
                      <a
                        href={shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t(lang, 'visitSite')}
                      </a>
                    </>
                  )}
                </div>
              </div>

              {!shop ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t(lang, 'shopSetup')}</div>
              ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-primary-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{shop.name?.[lang] || shop.name?.en}</h3>
                        <p className="text-sm opacity-75">{shop.address?.[lang] || shop.address?.en}</p>
                      </div>
                      <div className="flex gap-2">
                        {shop.phone && (
                          <a href={`tel:${shop.phone}`} className="bg-accent-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                            📞
                          </a>
                        )}
                        {shop.whatsapp && (
                          <a href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                            💬
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(shop.categories || []).map(c => (
                        <span key={c.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                          {c.icon} {c.name[lang]}
                        </span>
                      ))}
                    </div>
                    {products.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">{t(lang, 'noProducts')}</div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-3">
                        {products.map(p => (
                          <div key={p.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-3">
                            {p.image && (
                              <img src={p.image} alt={p.name.en} className="w-full h-28 object-cover rounded-lg mb-2" />
                            )}
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{p.name[lang]}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.desc[lang]}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-primary-600 text-sm">₹{p.price}</span>
                              {shop.whatsapp && (
                                <a
                                  href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I want to order: ${p.name.en} (₹${p.price})`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
                                >
                                  💬 {t(lang, 'orderOnWA')}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'crm' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[ 
                { label: t(lang, 'total'), val: leads.length, icon: '📋' },
                { label: t(lang, 'active'), val: activeLeads.length, icon: '🟢' },
                { label: t(lang, 'revenue'), val: `₹${totalRevenue}`, icon: '💰' },
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.val}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>

            {shop && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {loadingAnalytics ? '...' : analyticsData.shopVisits || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, 'visits')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-2xl mb-1">💬</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {loadingAnalytics ? '...' : analyticsData.whatsappClicks || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, 'waClicks')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {loadingAnalytics ? '...' : analyticsData.productViews || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t(lang, 'prodViews')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {loadingAnalytics ? '...' : analyticsData.conversions || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t(lang, 'conversions')} ({loadingAnalytics ? '...' : analyticsData.conversionRate || 0}%)
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{t(lang, 'crm')}</h3>
              <form onSubmit={addLeadFromForm} className="grid md:grid-cols-4 gap-3">
                <input name="leadName" placeholder={t(lang, 'leadName')} className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" required />
                <input name="leadPhone" placeholder={t(lang, 'phone')} className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" required />
                <select name="leadSource" className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                  <option value="">{t(lang, 'leadSource')}</option>
                  {LEAD_SOURCES.map(source => (
                    <option key={source} value={source}>{LEAD_SOURCE_ICONS[source]} {t(lang, source)}</option>
                  ))}
                </select>
                <input name="leadValue" type="number" min="0" placeholder={t(lang, 'leadValue')} className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                <input name="leadFollowUp" type="date" placeholder={t(lang, 'followUp')} className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                <input name="leadNotes" placeholder={t(lang, 'notes')} className="rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
                <button type="submit" className="bg-primary-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-primary-500 transition-all">
                  + {t(lang, 'save')}
                </button>
              </form>
            </div>

            {leads.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700">
                {t(lang, 'noLeads')}
              </div>
            ) : (
              <div className="space-y-3">
                {[...leads].reverse().map(lead => {
                  const id = lead.id
                  return (
                    <div key={id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{lead.name}</h4>
                            {lead.value > 0 && (
                              <span className="text-xs bg-green-50 dark:bg-green-900 px-2 py-0.5 rounded-full text-green-600 dark:text-green-400 font-medium">₹{lead.value}</span>
                            )}
                            {lead.product && <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">{lead.product}</span>}
                            {lead.source && (
                              <span className="text-xs bg-blue-50 dark:bg-blue-900 px-2 py-0.5 rounded-full text-blue-600 dark:text-blue-400">
                                {LEAD_SOURCE_ICONS[lead.source]} {t(lang, lead.source)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lead.phone}</p>
                          {lead.msg && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lead.msg}</p>}
                          {lead.followUp && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              📅 Follow-up: {new Date(lead.followUp).toLocaleDateString()}
                            </p>
                          )}
                          {lead.notes && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              📝 {lead.notes}
                            </p>
                          )}
                          {lead.customer && (
                            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                <strong>{t(lang, 'customer')}:</strong> {lead.customer.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                <strong>{t(lang, 'status')}:</strong> {t(lang, lead.customer.status)}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                <strong>{t(lang, 'purchases')}:</strong> {lead.customer.totalPurchases || 0}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={getStatus(id)}
                            onChange={e => setLeadStatus(id, e.target.value)}
                            className="text-xs rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                          >
                            {STATUS_KEYS.map(sk => (
                              <option key={sk} value={sk}>{STATUS_ICONS[sk]} {t(lang, sk)}</option>
                            ))}
                          </select>
                          <button onClick={() => handleDeleteLead(id)} className="text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function Input({ label, val, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
      />
    </div>
  )
}
