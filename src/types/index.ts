/**
 * Transaction types for budget tracking
 */
export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: Date
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface MonthlySummary {
  month: number
  year: number
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface BudgetState {
  transactions: Transaction[]
  categories: Category[]
  currentMonth: number
  currentYear: number
}
