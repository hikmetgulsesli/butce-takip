import { useState, useEffect } from 'react'
import { EmptyState } from './components/EmptyState'
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog'
import { Trash2 } from 'lucide-react'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleConfirmDelete = () => {
    console.log('İşlem silindi')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark transition-colors">
      {/* Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="text-primary text-2xl font-bold">₺</span>
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-xl font-bold font-sora tracking-tight">
            Bütçe Takibi
          </h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
          {isDark ? 'Açık Tema' : 'Koyu Tema'}
        </button>
      </header>

      <main className="p-8">
        {/* EmptyState Demo */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 font-sora">
            Boş Durum (EmptyState)
          </h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <EmptyState />
          </div>
        </section>

        {/* DeleteConfirmationDialog Demo */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 font-sora">
            Silme Onay Diyaloğu (DeleteConfirmationDialog)
          </h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Silme Diyaloğunu Aç
            </button>
          </div>
        </section>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default App
