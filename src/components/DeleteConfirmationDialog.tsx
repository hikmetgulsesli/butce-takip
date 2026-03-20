import { Trash2, X, AlertTriangle } from 'lucide-react'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'İşlemi Sil',
  message = 'Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm ilişkili veriler kalıcı olarak kaldırılacaktır.'
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="dialog-backdrop"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Warning Icon */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-sora mb-2">
              {title}
            </h3>
            
            {/* Body text */}
            <p className="text-slate-600 dark:text-slate-300 font-nunito leading-relaxed text-base">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>İptal</span>
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Sil</span>
          </button>
        </div>
      </div>
    </div>
  )
}
