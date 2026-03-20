import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { Transaction } from '../types'
import { getCategory } from '../constants/categories'

interface CategoryPieChartProps {
  transactions: Transaction[]
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  // Aggregate expenses by category
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = getCategory(t.category)
      const name = category?.name || t.category
      acc[name] = (acc[name] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = ['#3d84f5', '#22c55e', '#ef4444', '#f59e0b', '#a855f7', '#ec4899', '#64748b']

  const totalExpense = data.reduce((sum, item) => sum + item.value, 0)

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 font-heading text-slate-900 dark:text-white">Kategori Bazlı Harcamalar</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400 font-body">Henüz gider kaydı yok</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <h2 className="text-lg font-semibold mb-6 font-heading text-slate-900 dark:text-white">Kategori Bazlı Harcamalar</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-body">Toplam</div>
        <div className="font-bold text-sm text-slate-900 dark:text-white font-heading">
          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalExpense)}
        </div>
      </div>
    </div>
  )
}
