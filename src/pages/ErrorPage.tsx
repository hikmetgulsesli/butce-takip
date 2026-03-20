/**
 * Error Page (404/Error Routes)
 * US-011: Full Transaction List View & Error Pages
 * 
 * Displays 'Sayfa Bulunamadi' message with 'Ana Sayfaya Don' link.
 * Implements screen: b09b1e6df1d44a70a5329a05995cfeb4 (Hata Sayfasi)
 */

import { Link, useNavigate } from 'react-router-dom'
import { RefreshCw, X, Wallet, HeadphonesIcon } from 'lucide-react'

interface ErrorPageProps {
  errorCode?: string
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
}

export function ErrorPage({ 
  errorCode = 'ERR_500',
  title = 'Bir hata oluştu',
  message = 'İşlem sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
  showRetry = true,
  onRetry
}: ErrorPageProps) {
  const navigate = useNavigate()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="flex h-full grow flex-col w-full items-center justify-center px-4">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full flex items-center justify-between border-b border-rose-500/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 lg:px-40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-rose-500 rounded-lg text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight font-heading">
              Kişisel Bütçe Takip
            </h2>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-500/20 hover:text-rose-500 transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center w-full max-w-md">
          <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 p-8 flex flex-col items-center">
            {/* Error Icon */}
            <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/10 text-rose-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Title & Message */}
            <div className="flex flex-col items-center gap-3 text-center mb-8">
              <h1 className="text-slate-900 dark:text-slate-50 text-2xl font-bold font-heading">
                {title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base font-body leading-relaxed">
                {message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              {showRetry && (
                <button 
                  onClick={handleRetry}
                  className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-rose-500 hover:bg-rose-500/90 text-white text-sm font-bold transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-heading">Tekrar Dene</span>
                </button>
              )}
              <Link 
                to="/"
                className="w-full flex items-center justify-center rounded-lg h-12 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-semibold transition-all"
              >
                <span className="font-heading">Ana Sayfaya Dön</span>
              </Link>
            </div>

            {/* Error Code */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 w-full text-center">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-mono tracking-widest uppercase">
                Hata Kodu: {errorCode}
              </p>
            </div>
          </div>

          {/* Support Link */}
          <div className="mt-8 flex items-center gap-2 text-slate-400 dark:text-slate-600 text-sm">
            <HeadphonesIcon className="w-4 h-4" />
            <span>Destek ekibiyle iletişime geçin</span>
          </div>
        </main>

        {/* Background Decoration */}
        <div className="fixed bottom-8 opacity-20 pointer-events-none">
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-rose-500 rounded-full blur-[80px]"></div>
            <div className="w-32 h-32 bg-rose-500 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 404 Not Found Page
 * Specific error page for 404 routes
 */
export function NotFoundPage() {
  return (
    <ErrorPage 
      errorCode="404"
      title="Sayfa Bulunamadı"
      message="Aradığınız sayfa mevcut değil veya taşınmış olabilir."
      showRetry={false}
    />
  )
}
