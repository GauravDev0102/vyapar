import { useRouter } from 'next/router'
import { Store } from 'lucide-react'
import Head from 'next/head'

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Page Not Found — Vyapar</title>
      </Head>
      <div className="text-center px-4">
        <Store className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
        <p className="text-6xl font-extrabold text-primary-600 mb-2">404</p>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Page not found</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">यह पेज नहीं मिला या हटा दिया गया है।</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20"
        >
          ← Go Home / होम पर जाएं
        </button>
      </div>
    </div>
  )
}
