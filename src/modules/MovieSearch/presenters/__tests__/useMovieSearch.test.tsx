import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import type { Movie } from '@/modules/MovieSearch/entity/dto/movieSearch'
import { MOVIE_SEARCH_DEBOUNCE_MS } from '@/modules/MovieSearch/constants/movieSearch.constants'
import {
  MovieSearchHistoryProvider,
} from '@/modules/MovieSearch/presenters/SearchHistoryContext'
import { useMovieSearch } from '@/modules/MovieSearch/presenters/useMovieSearch'
import {
  fetchMovieGenres,
  searchMovies,
} from '@/modules/MovieSearch/entity/movieSearch.api'

vi.mock('@/modules/MovieSearch/entity/movieSearch.api', () => ({
  fetchMovieGenres: vi.fn(),
  searchMovies: vi.fn(),
}))

const storage = new Map<string, string>()

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <MovieSearchHistoryProvider>{children}</MovieSearchHistoryProvider>
    </MemoryRouter>
  )
}

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

function createSearchResponse(movies: Movie[]) {
  return {
    movies,
    page: 1,
    totalPages: 1,
    totalResults: movies.length,
  }
}

function createDeferredPromise<T>() {
  let resolvePromise!: (value: T) => void

  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve
  })

  return {
    promise,
    resolve: resolvePromise,
  }
}

describe('useMovieSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
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

    vi.mocked(fetchMovieGenres).mockResolvedValue({})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('clears the public results state when the search input is cleared', async () => {
    vi.mocked(searchMovies).mockResolvedValue(createSearchResponse([createMovie()]))

    const { result } = renderHook(() => useMovieSearch(), { wrapper })

    act(() => {
      result.current.changeQuery('Interstellar')
    })

    expect(result.current.isWaitingForDebounce).toBe(true)
    expect(result.current.movies).toEqual([])
    expect(result.current.hasMovies).toBe(false)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(MOVIE_SEARCH_DEBOUNCE_MS)
    })

    expect(searchMovies).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe('success')
    expect(result.current.movies).toHaveLength(1)
    expect(result.current.hasMovies).toBe(true)

    act(() => {
      result.current.changeQuery('')
    })

    expect(result.current.query).toBe('')
    expect(result.current.debouncedQuery).toBe('')
    expect(result.current.movies).toEqual([])
    expect(result.current.hasMovies).toBe(false)
    expect(result.current.status).toBe('idle')
  })

  it('ignores a stale pending response after the input is cleared', async () => {
    const pendingSearch = createDeferredPromise<
      ReturnType<typeof createSearchResponse>
    >()

    vi.mocked(searchMovies).mockReturnValueOnce(pendingSearch.promise)

    const { result } = renderHook(() => useMovieSearch(), { wrapper })

    act(() => {
      result.current.changeQuery('Alien')
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(MOVIE_SEARCH_DEBOUNCE_MS)
    })

    expect(searchMovies).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe('loading')

    act(() => {
      result.current.changeQuery('')
    })

    expect(result.current.status).toBe('idle')
    expect(result.current.movies).toEqual([])

    await act(async () => {
      pendingSearch.resolve(createSearchResponse([createMovie({ title: 'Alien' })]))
      await Promise.resolve()
    })

    expect(result.current.query).toBe('')
    expect(result.current.movies).toEqual([])
    expect(result.current.hasMovies).toBe(false)
    expect(result.current.status).toBe('idle')
  })
})
