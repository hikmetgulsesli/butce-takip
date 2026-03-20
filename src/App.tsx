/**
 * App.tsx - Main Application Router
 * US-012: Integration Wiring & End-to-End Verification
 * 
 * Wire all components into App.tsx with React Router.
 * Routes: '/' for Dashboard, '/islemler' for full transaction list, '*' for ErrorPage.
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { IslemListesiPage } from './pages/IslemListesiPage'
import { AddTransactionPage } from './pages/AddTransactionPage'
import { ErrorPage } from './pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/ekle',
    element: <AddTransactionPage />,
  },
  {
    path: '/islemler',
    element: <IslemListesiPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
