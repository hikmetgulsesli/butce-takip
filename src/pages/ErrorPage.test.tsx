/**
 * Tests for ErrorPage
 * US-011: Full Transaction List View & Error Pages
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorPage, NotFoundPage } from './ErrorPage'

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn()
  }
})

describe('ErrorPage', () => {
  it('renders default error title correctly', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Bir hata oluştu')).toBeInTheDocument()
  })

  it('renders error message correctly', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/İşlem sırasında beklenmeyen bir hata oluştu/)).toBeInTheDocument()
  })

  it('displays error code', () => {
    render(
      <BrowserRouter>
        <ErrorPage errorCode="ERR_500" />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Hata Kodu: ERR_500')).toBeInTheDocument()
  })

  it('has "Tekrar Dene" button when showRetry is true', () => {
    render(
      <BrowserRouter>
        <ErrorPage showRetry={true} />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument()
  })

  it('does not show retry button when showRetry is false', () => {
    render(
      <BrowserRouter>
        <ErrorPage showRetry={false} />
      </BrowserRouter>
    )
    
    expect(screen.queryByText('Tekrar Dene')).not.toBeInTheDocument()
  })

  it('has "Ana Sayfaya Dön" link', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Ana Sayfaya Dön')).toBeInTheDocument()
  })

  it('calls onRetry when Tekrar Dene button is clicked', () => {
    const handleRetry = vi.fn()
    render(
      <BrowserRouter>
        <ErrorPage showRetry={true} onRetry={handleRetry} />
      </BrowserRouter>
    )
    
    const retryButton = screen.getByText('Tekrar Dene')
    fireEvent.click(retryButton)
    
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('renders custom title and message', () => {
    render(
      <BrowserRouter>
        <ErrorPage 
          title="Özel Hata Başlığı"
          message="Özel hata mesajı açıklaması"
        />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Özel Hata Başlığı')).toBeInTheDocument()
    expect(screen.getByText('Özel hata mesajı açıklaması')).toBeInTheDocument()
  })

  it('displays app header with correct branding', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Kişisel Bütçe Takip')).toBeInTheDocument()
  })

  it('has close button in header', () => {
    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    )
    
    expect(screen.getByLabelText('Kapat')).toBeInTheDocument()
  })
})

describe('NotFoundPage', () => {
  it('renders 404 title correctly', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Sayfa Bulunamadı')).toBeInTheDocument()
  })

  it('displays 404 error code', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Hata Kodu: 404')).toBeInTheDocument()
  })

  it('does not show retry button for 404', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    )
    
    expect(screen.queryByText('Tekrar Dene')).not.toBeInTheDocument()
  })

  it('has "Ana Sayfaya Dön" link', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Ana Sayfaya Dön')).toBeInTheDocument()
  })

  it('displays appropriate message for 404', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Aradığınız sayfa mevcut değil/)).toBeInTheDocument()
  })
})
