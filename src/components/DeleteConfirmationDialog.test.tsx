import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'

describe('DeleteConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  }

  it('does not render when isOpen is false', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('İşlemi Sil')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />)
    expect(screen.getByText('İşlemi Sil')).toBeInTheDocument()
    expect(screen.getByText('Bu işlemi silmek istediğinize emin misiniz?')).toBeInTheDocument()
  })

  it('displays confirmation message', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />)
    expect(screen.getByText(/Bu işlemi silmek istediğinize emin misiniz/)).toBeInTheDocument()
  })

  it('has cancel button that closes dialog', () => {
    const onClose = vi.fn()
    render(<DeleteConfirmationDialog {...defaultProps} onClose={onClose} />)
    
    const cancelButton = screen.getByText('İptal')
    fireEvent.click(cancelButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has delete button that triggers onConfirm and closes dialog', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(<DeleteConfirmationDialog {...defaultProps} onConfirm={onConfirm} onClose={onClose} />)
    
    const deleteButton = screen.getByText('Sil')
    fireEvent.click(deleteButton)
    
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has red delete button', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />)
    
    const deleteButton = screen.getByText('Sil').closest('button')
    expect(deleteButton).toHaveClass('bg-rose-600')
  })

  it('closes dialog when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<DeleteConfirmationDialog {...defaultProps} onClose={onClose} />)
    
    const backdrop = screen.getByTestId('dialog-backdrop')
    fireEvent.click(backdrop)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking dialog content', () => {
    const onClose = vi.fn()
    render(<DeleteConfirmationDialog {...defaultProps} onClose={onClose} />)
    
    const dialogContent = screen.getByText('İşlemi Sil').closest('div')?.parentElement
    if (dialogContent) {
      fireEvent.click(dialogContent)
    }
    
    // onClose should not be called when clicking inside dialog
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has close button that closes dialog', () => {
    const onClose = vi.fn()
    render(<DeleteConfirmationDialog {...defaultProps} onClose={onClose} />)
    
    const closeButton = screen.getByLabelText('Kapat')
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
