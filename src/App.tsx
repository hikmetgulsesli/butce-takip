import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { AddTransactionPage } from './pages/AddTransactionPage'
import { IslemListesiPage } from './pages/IslemListesiPage'
import { ErrorPage, NotFoundPage } from './pages/ErrorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/islem-ekle" element={<AddTransactionPage />} />
        <Route path="/islemler" element={<IslemListesiPage />} />
        <Route path="/hata" element={<ErrorPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
