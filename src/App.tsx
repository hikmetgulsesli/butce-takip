/**
 * App Router Component
 * Sets up React Router with all routes
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { AddTransactionPage } from './pages/AddTransactionPage'
import { TransactionsPage } from './pages/TransactionsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/add-transaction" element={<AddTransactionPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
