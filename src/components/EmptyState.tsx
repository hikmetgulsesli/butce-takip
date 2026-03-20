import { Wallet } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  icon?: React.ReactNode
}

export function EmptyState({ 
  message = 'Henüz işlem eklemediniz',
  icon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        {icon || <Wallet className="h-10 w-10 text-slate-400 dark:text-slate-500" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-sora mb-2">
        {message}
      </h3>
    </div>
  )
}
