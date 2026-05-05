import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MovieSearch } from '@/modules/MovieSearch/ui/MovieSearchView'
import { useMovieSearchView } from '@/modules/MovieSearch/presenters/useMovieSearchView'

vi.mock('@/modules/MovieSearch/presenters/useMovieSearchView', () => ({
  useMovieSearchView: vi.fn(),
}))

vi.mock('@/modules/MovieSearch/components/SearchInput', () => ({
  SearchInput: ({ value }: { value: string }) => (
    <input aria-label="Search for movies" readOnly value={value} />
  ),
}))

vi.mock('@/modules/MovieSearch/components/AutocompleteDropdown', () => ({
  AutocompleteDropdown: () => <div>Autocomplete</div>,
}))

vi.mock('@/modules/MovieSearch/components/MovieFilters', () => ({
  MovieFilters: () => <div>Filters</div>,
}))

vi.mock('@/modules/MovieSearch/components/MovieList', () => ({
  MovieList: ({ movies }: { movies: Array<{ title: string }> }) => (
    <div>{movies.map((movie) => movie.title).join(', ')}</div>
  ),
}))

vi.mock('@/modules/MovieSearch/components/Pagination', () => ({
  Pagination: ({
    currentPage,
    totalPages,
  }: {
    currentPage: number
    totalPages: number
  }) => <div>{`Pagination ${currentPage}/${totalPages}`}</div>,
}))

vi.mock('@/modules/MovieSearch/components/ProgressBar', () => ({
  ProgressBar: ({ visible }: { visible: boolean }) =>
    visible ? <div>Progress</div> : null,
}))

vi.mock('@/modules/MovieSearch/components/SkeletonGrid', () => ({
  SkeletonGrid: () => <div>Skeleton</div>,
}))

vi.mock('@/modules/MovieSearch/components/EmptyState', () => ({
  EmptyState: ({
    description,
    title,
  }: {
    description: string
    title: string
  }) => (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}))

function createViewModel(
  overrides: Partial<ReturnType<typeof useMovieSearchView>> = {},
): ReturnType<typeof useMovieSearchView> {
  return {
    autocompleteDropdownProps: {
      isOpen: false,
      items: [],
      onClearHistory: vi.fn(),
      onSelect: vi.fn(),
      showClearHistory: false,
      statusMessage: null,
    },
    hasMovies: false,
    movieFiltersProps: {
      filters: {
        includeAdult: false,
        language: 'en-US',
        page: 1,
        primaryReleaseYear: '',
        region: '',
        year: '',
      },
      isOpen: false,
      languageOptions: [],
      onChange: vi.fn(),
      onToggle: vi.fn(),
      regionOptions: [],
    },
    movieListProps: {
      movies: [],
    },
    paginationProps: {
      currentPage: 1,
      onPageChange: vi.fn(),
      totalPages: 1,
    },
    progressVisible: false,
    resultsCountLabel: '0 movies found',
    resultsReference: createRef<HTMLElement>(),
    resultsRequestKey: 'query=',
    retryResults: vi.fn(),
    searchContainerReference: createRef<HTMLDivElement>(),
    searchError: null,
    searchInputProps: {
      onChange: vi.fn(),
      onFocus: vi.fn(),
      onHideSuggestions: vi.fn(),
      onSubmit: vi.fn(),
      value: '',
    },
    showEmptyState: false,
    showErrorState: false,
    showRefreshingState: false,
    showResultsSection: false,
    showSkeleton: false,
    ...overrides,
  }
}

describe('MovieSearch', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not render the results section before the search state asks for it', () => {
    vi.mocked(useMovieSearchView).mockReturnValue(createViewModel())

    render(
      <MemoryRouter>
        <MovieSearch />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Search Results')).not.toBeInTheDocument()
  })

  it('renders previous results when the results section is visible', () => {
    vi.mocked(useMovieSearchView).mockReturnValue(
      createViewModel({
        hasMovies: true,
        movieListProps: {
          movies: [
            {
              genres: ['Action'],
              href: '/movies/11',
              overview: 'Explorers travel through a wormhole in space.',
              posterUrl: null,
              rating: '8.7',
              title: 'Interstellar',
              year: '2014',
            },
          ],
        },
        paginationProps: {
          currentPage: 2,
          onPageChange: vi.fn(),
          totalPages: 8,
        },
        resultsCountLabel: '1 movie found',
        showResultsSection: true,
      }),
    )

    render(
      <MemoryRouter>
        <MovieSearch />
      </MemoryRouter>,
    )

    expect(screen.getByText('Search Results')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText('Pagination 2/8')).toBeInTheDocument()
  })

  it('renders the results shell and skeleton while a search is pending', () => {
    vi.mocked(useMovieSearchView).mockReturnValue(
      createViewModel({
        resultsCountLabel: '',
        showResultsSection: true,
        showSkeleton: true,
      }),
    )

    render(
      <MemoryRouter>
        <MovieSearch />
      </MemoryRouter>,
    )

    expect(screen.getByText('Search Results')).toBeInTheDocument()
    expect(screen.getByText('Skeleton')).toBeInTheDocument()
  })

  it('shows the error boundary fallback and retries the request on demand', () => {
    const retryResults = vi.fn()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.mocked(useMovieSearchView).mockReturnValue(
      createViewModel({
        resultsCountLabel: '0 movies found',
        retryResults,
        searchError: new Error('No internet connection. Check your connection and try again.'),
        showErrorState: true,
        showResultsSection: true,
      }),
    )

    render(
      <MemoryRouter>
        <MovieSearch />
      </MemoryRouter>,
    )

    expect(screen.getByText('Unable to load movies')).toBeInTheDocument()
    expect(
      screen.getByText('No internet connection. Check your connection and try again.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(retryResults).toHaveBeenCalledOnce()
    consoleErrorSpy.mockRestore()
  })
})
