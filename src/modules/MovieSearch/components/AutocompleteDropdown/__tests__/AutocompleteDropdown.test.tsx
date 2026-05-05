import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AutocompleteDropdown } from '@/modules/MovieSearch/components/AutocompleteDropdown'

describe('AutocompleteDropdown', () => {
  it('renders recent searches when query is empty', () => {
    const onClearHistory = vi.fn()
    const onSelect = vi.fn()

    render(
      <AutocompleteDropdown
        isOpen
        items={[
          {
            id: 'Interstellar',
            posterUrl: null,
            subtitle: 'Recent search',
            title: 'Interstellar',
            value: 'Interstellar',
          },
          {
            id: 'Dune',
            posterUrl: null,
            subtitle: 'Recent search',
            title: 'Dune',
            value: 'Dune',
          },
        ]}
        onClearHistory={onClearHistory}
        onSelect={onSelect}
        showClearHistory
        statusMessage={null}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Interstellar Recent search' }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear search history' }))

    expect(screen.getAllByText('Recent search')).toHaveLength(2)
    expect(onSelect).toHaveBeenCalledWith('Interstellar')
    expect(onClearHistory).toHaveBeenCalledOnce()
  })
})
