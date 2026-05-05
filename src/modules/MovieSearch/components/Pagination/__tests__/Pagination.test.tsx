import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from '@/modules/MovieSearch/components/Pagination'

describe('Pagination', () => {
  it('changes page through navigation controls', () => {
    const onPageChange = vi.fn()

    render(<Pagination currentPage={3} onPageChange={onPageChange} totalPages={8} />)

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 2)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4)
    expect(onPageChange).toHaveBeenNthCalledWith(3, 4)
  })

  it('disables boundary navigation buttons', () => {
    render(<Pagination currentPage={1} onPageChange={vi.fn()} totalPages={3} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled()
  })
})
