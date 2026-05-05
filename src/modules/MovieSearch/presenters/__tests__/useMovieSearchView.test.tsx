import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Movie } from '@/modules/MovieSearch/entity/dto/movieSearch'
import type { UseMovieSearchResult } from '@/modules/MovieSearch/types/movieSearch.types'
import { useMovieSearchView } from '@/modules/MovieSearch/presenters/useMovieSearchView'
import { useMovieSearch } from '@/modules/MovieSearch/presenters/useMovieSearch'

vi.mock('@/hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}))

vi.mock('@/modules/MovieSearch/presenters/useMovieSearch', () => ({
  useMovieSearch: vi.fn(),
}))

function createMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    adult: false,
    backdropPath: '/backdrop.jpg',
    genreIds: [28],
    id: 11,
    originalLanguage: 'en',
    originalTitle: 'Interstellar',
    overview: 'Explorers travel through a wormhole in space.',
    popularity: 99,
    posterPath: '/poster.jpg',
    releaseDate: '2014-11-07',
    title: 'Interstellar',
    video: false,
    voteAverage: 8.7,
    voteCount: 20000,
    ...overrides,
  }
}

function createMovieSearchState(
  overrides: Partial<UseMovieSearchResult> = {},
): UseMovieSearchResult {
  return {
    changePage: vi.fn(),
    changeQuery: vi.fn(),
    clearHistory: vi.fn(),
    debouncedQuery: '',
    error: null,
    executedQuery: '',
    filters: {
      includeAdult: false,
      language: 'en-US',
      page: 1,
      primaryReleaseYear: '',
      region: '',
      year: '',
    },
    genresById: {
      28: 'Action',
    },
    hasMovies: false,
    historyTerms: [],
    isLoading: false,
    isRefreshing: false,
    isWaitingForDebounce: false,
    movies: [],
    query: '',
    retry: vi.fn(),
    selectQuery: vi.fn(),
    status: 'idle',
    submitQuery: vi.fn(),
    totalPages: 0,
    totalResults: 0,
    updateFilters: vi.fn(),
    ...overrides,
  }
}

describe('useMovieSearchView', () => {
  it('hides the results section when there is no active query and no previous state to show', () => {
    vi.mocked(useMovieSearch).mockReturnValue(createMovieSearchState())

    const { result } = renderHook(() => useMovieSearchView())

    expect(result.current.showResultsSection).toBe(false)
  })

  it('shows the results section immediately and exposes a skeleton while a typed query is still debouncing', () => {
    vi.mocked(useMovieSearch).mockReturnValue(
      createMovieSearchState({
        debouncedQuery: '',
        isWaitingForDebounce: true,
        query: 'Interstellar',
      }),
    )

    const { result } = renderHook(() => useMovieSearchView())

    expect(result.current.showResultsSection).toBe(true)
    expect(result.current.showSkeleton).toBe(true)
    expect(result.current.resultsCountLabel).toBe('')
  })

  it('hides the results section after the input is cleared even if the previous search had movies', () => {
    vi.mocked(useMovieSearch).mockReturnValue(
      createMovieSearchState({
        executedQuery: 'Interstellar',
        hasMovies: true,
        movies: [createMovie()],
        query: '',
        status: 'success',
        totalResults: 1,
      }),
    )

    const { result } = renderHook(() => useMovieSearchView())

    expect(result.current.showResultsSection).toBe(false)
  })

  it('exposes error and loading flags for the results section state machine', () => {
    vi.mocked(useMovieSearch).mockReturnValue(
      createMovieSearchState({
        debouncedQuery: 'Alien',
        error: new Error('Unable to load movies right now.'),
        query: 'Alien',
        status: 'error',
      }),
    )

    const { result } = renderHook(() => useMovieSearchView())

    expect(result.current.showResultsSection).toBe(true)
    expect(result.current.showErrorState).toBe(true)
    expect(result.current.showSkeleton).toBe(false)
  })

  it('blurs the search input after selecting an autocomplete item', () => {
    const selectQuery = vi.fn()
    const blur = vi.fn()

    vi.mocked(useMovieSearch).mockReturnValue(
      createMovieSearchState({
        query: 'Interstellar',
        selectQuery,
      }),
    )

    const { result } = renderHook(() => useMovieSearchView())

    const container = document.createElement('div')
    const input = document.createElement('input')

    input.type = 'search'
    input.blur = blur
    container.append(input)
    result.current.searchContainerReference.current = container

    act(() => {
      result.current.autocompleteDropdownProps.onSelect('Dune')
    })

    expect(selectQuery).toHaveBeenCalledWith('Dune')
    expect(blur).toHaveBeenCalledOnce()
  })
})
