import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SearchInput } from '@/modules/MovieSearch/components/SearchInput'

describe('SearchInput', () => {
  it('submits immediately when the user presses Enter', () => {
    const onSubmit = vi.fn()

    render(
      <SearchInput
        onChange={vi.fn()}
        onFocus={vi.fn()}
        onHideSuggestions={vi.fn()}
        onSubmit={onSubmit}
        value="Interstellar"
      />,
    )

    const input = screen.getByRole('searchbox', { name: 'Search for movies' })
    input.focus()

    expect(input).toHaveFocus()

    fireEvent.keyDown(input, {
      key: 'Enter',
    })

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(input).not.toHaveFocus()
  })

  it('hides suggestions when the user presses Escape', () => {
    const onHideSuggestions = vi.fn()

    render(
      <SearchInput
        onChange={vi.fn()}
        onFocus={vi.fn()}
        onHideSuggestions={onHideSuggestions}
        onSubmit={vi.fn()}
        value="Interstellar"
      />,
    )

    fireEvent.keyDown(screen.getByRole('searchbox', { name: 'Search for movies' }), {
      key: 'Escape',
    })

    expect(onHideSuggestions).toHaveBeenCalledOnce()
  })
})
