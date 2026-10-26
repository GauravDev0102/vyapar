import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Store, Smartphone, MessageCircle, BarChart3, Globe, ArrowRight } from 'lucide-react'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [dark, setDark] = useState(false)
  useEffect(() => {
    setLang(localStorage.getItem('vyapar_lang') || 'en')
    const d = localStorage.getItem('vyapar_dark') === 'true'
    setDark(d)
    document.documentElement.classList.toggle('dark', d)
  }, [])

  const t = (en, hi) => lang === 'hi' ? hi : en

  const features = [
    { icon: Globe, title: t('Auto Website', 'ऑटो वेबसाइट'), desc: t('Generate a bilingual storefront in minutes', 'मिनटों में द्विभाषी स्टोरफ्रंट बनाएं') },
    { icon: MessageCircle, title: t('WhatsApp Commerce', 'व्हाट्सएप कॉमर्स'), desc: t('Sell directly via WhatsApp', 'सीधे व्हाट्सएप पर बेचें') },
    { icon: BarChart3, title: t('CRM Dashboard', 'CRM डैशबोर्ड'), desc: t('Track leads & manage customers', 'लीड ट्रैक करें और ग्राहक प्रबंधित करें') },
    { icon: Smartphone, title: t('Mobile App', 'मोबाइल ऐप'), desc: t('Coming Soon - Manage your shop on the go', 'जल्द आ रहा है - चलते-फिरते अपनी दुकान प्रबंधित करें') },
    { icon: Store, title: t('Bilingual', 'द्विभाषी'), desc: t('English & Hindi support', 'अंग्रेज़ी और हिंदी समर्थन') },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>Vyapar — Your Shop, Online in Minutes</title>
        <meta name="description" content="Turn your local shop into an online business with a bilingual storefront, QR codes and WhatsApp selling — in English & Hindi." />
      </Head>
      <nav className="glass border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              title="Back to top"
              className="flex items-center gap-2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40 rounded-lg"
            >
              <Store className="w-6 h-6 text-primary-600 group-hover:text-primary-300 transition-colors" />
              <span className="font-bold text-lg text-primary-600 group-hover:text-primary-300 transition-colors">Vyapar</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { const d = !dark; setDark(d); localStorage.setItem('vyapar_dark', d); document.documentElement.classList.toggle('dark', d) }}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => { const l = lang === 'en' ? 'hi' : 'en'; setLang(l); localStorage.setItem('vyapar_lang', l) }}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20"
            >
              {t('Get Started', 'शुरू करें')}
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-primary-700 dark:text-primary-300 leading-tight"
        >
          {t('Your Shop, Online in Minutes', 'आपकी दुकान, मिनटों में ऑनलाइन')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto"
        >
          {t('Turn your local shop into an online business with a bilingual storefront, QR codes and WhatsApp selling — in English & Hindi.', 'अपनी दुकान को द्विभाषी स्टोरफ्रंट, QR कोड और व्हाट्सएप सेलिंग के साथ ऑनलाइन व्यवसाय में बदलें — हिंदी और अंग्रेज़ी में।')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-accent-400 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-accent-500 transition-all shadow-xl shadow-accent-400/30 flex items-center gap-2"
          >
            {t('Build Your Shop Free', 'अपनी दुकान मुफ्त बनाएं')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
