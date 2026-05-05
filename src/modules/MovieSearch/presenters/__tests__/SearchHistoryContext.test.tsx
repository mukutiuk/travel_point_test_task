import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  MovieSearchHistoryProvider,
  useMovieSearchHistory,
} from '@/modules/MovieSearch/presenters/SearchHistoryContext'

const storage = new Map<string, string>()

function wrapper({ children }: { children: React.ReactNode }) {
  return <MovieSearchHistoryProvider>{children}</MovieSearchHistoryProvider>
}

describe('SearchHistoryContext', () => {
  beforeEach(() => {
    storage.clear()

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        clear() {
          storage.clear()
        },
        getItem(key: string) {
          return storage.get(key) ?? null
        },
        removeItem(key: string) {
          storage.delete(key)
        },
        setItem(key: string, value: string) {
          storage.set(key, value)
        },
      },
    })
  })

  it('hydrates from storage and keeps the newest unique term first', () => {
    window.localStorage.setItem(
      'tmdb-search-history',
      JSON.stringify(['Dune', 'Alien']),
    )

    const { result } = renderHook(() => useMovieSearchHistory(), { wrapper })

    expect(result.current.terms).toEqual(['Dune', 'Alien'])

    act(() => {
      result.current.addTerm('alien')
    })

    expect(result.current.terms).toEqual(['alien', 'Dune'])
    expect(JSON.parse(window.localStorage.getItem('tmdb-search-history') ?? '[]')).toEqual([
      'alien',
      'Dune',
    ])
  })

  it('removes individual items and clears the entire history', () => {
    const { result } = renderHook(() => useMovieSearchHistory(), { wrapper })

    act(() => {
      result.current.addTerm('Interstellar')
      result.current.addTerm('Blade Runner')
    })

    act(() => {
      result.current.removeTerm('Interstellar')
    })

    expect(result.current.terms).toEqual(['Blade Runner'])

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.terms).toEqual([])
    expect(JSON.parse(window.localStorage.getItem('tmdb-search-history') ?? '[]')).toEqual([])
  })
})
