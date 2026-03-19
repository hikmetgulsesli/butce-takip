import { useState, useEffect } from 'react'

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-surface-dark transition-colors">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white">
          Kişisel Bütçe Takip
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-body">
          Proje başarıyla kuruldu!
        </p>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer"
        >
          {isDark ? 'Açık Tema' : 'Koyu Tema'}
        </button>
      </div>
    </div>
  )
}

export default App
