import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      {children}
    </div>
  )
}

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer'
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    danger: 'bg-expense text-white hover:bg-red-600',
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
