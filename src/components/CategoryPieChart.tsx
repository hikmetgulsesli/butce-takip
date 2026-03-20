/**
 * CategoryPieChart Component
 * US-007: Category Pie Chart Component
 * 
 * Shows expense distribution by category for selected month using recharts.
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { Transaction, CategoryKey } from '../types'
import { getCategory } from '../constants/categories'

interface CategoryPieChartProps {
  transactions: Transaction[]
  selectedMonth: number
  selectedYear: number
}

interface PieDataItem {
  name: string
  value: number
  color: string
  category: CategoryKey
}

export function CategoryPieChart({ 
  transactions, 
  selectedMonth, 
  selectedYear 
}: CategoryPieChartProps) {
  // Filter expenses for selected month/year
  const monthlyExpenses = transactions.filter(t => {
    const tDate = new Date(t.date)
    return t.type === 'expense' && 
           tDate.getMonth() === selectedMonth && 
           tDate.getFullYear() === selectedYear
  })

  // Aggregate expenses by category
  const categoryTotals = new Map<CategoryKey, number>()
  
  monthlyExpenses.forEach(t => {
    const current = categoryTotals.get(t.category) || 0
    categoryTotals.set(t.category, current + t.amount)
  })

  // Prepare data for recharts
  const pieData: PieDataItem[] = Array.from(categoryTotals.entries())
    .map(([category, amount]) => {
      const cat = getCategory(category)
      return {
        name: cat?.name || category,
        value: amount,
        color: cat?.color || '#64748b',
        category
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  // Calculate total for percentages
  const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0)

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { 
    active?: boolean 
    payload?: Array<{ payload: PieDataItem }>
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      const percentage = totalExpenses > 0 
        ? Math.round((data.value / totalExpenses) * 100) 
        : 0
      return (
        <div className="bg-white dark:bg-surface-dark p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">{data.name}</p>
          <p className="text-expense font-bold">
            {data.value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">%{percentage}</p>
        </div>
      )
    }
    return null
  }

  // Custom legend
  const CustomLegend = ({ payload }: { payload?: Array<{ payload: PieDataItem }> }) => {
    if (!payload) return null
    
    return (
      <ul className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => {
          const data = entry.payload
          const percentage = totalExpenses > 0 
            ? Math.round((data.value / totalExpenses) * 100) 
            : 0
          return (
            <li 
              key={`legend-${index}`} 
              className="flex items-center gap-2 text-sm"
            >
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: data.color }}
              />
              <span className="text-slate-700 dark:text-slate-300">
                {data.name} (%{percentage})
              </span>
            </li>
          )
        })}
      </ul>
    )
  }

  // Empty state
  if (pieData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Bu ay gider yok
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
          Bu ay için henüz gider kaydı bulunmamaktadır.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryPieChart
