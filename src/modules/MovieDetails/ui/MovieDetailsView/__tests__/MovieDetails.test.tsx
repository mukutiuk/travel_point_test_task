import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { MovieDetails as MovieDetailsEntity } from '@/modules/MovieDetails/entity/dto/movieDetails.entity'
import { MovieDetails } from '@/modules/MovieDetails/ui/MovieDetailsView'
import { useMovieDetails } from '@/modules/MovieDetails/presenters/useMovieDetails'

vi.mock('@/modules/MovieDetails/presenters/useMovieDetails', () => ({
  useMovieDetails: vi.fn(),
}))

function createMovie(overrides: Partial<MovieDetailsEntity> = {}): MovieDetailsEntity {
  return {
    adult: false,
    backdropPath: '/backdrop.jpg',
    budget: 165000000,
    genres: [
      {
        id: 12,
        name: 'Adventure',
      },
    ],
    homepage: 'https://example.com/interstellar',
    id: 157336,
    imdbId: 'tt0816692',
    originCountries: ['US'],
    originalLanguage: 'en',
    originalTitle: 'Interstellar',
    overview: 'Explorers travel through a wormhole in space.',
    popularity: 120,
    posterPath: '/poster.jpg',
    productionCountries: [
      {
        code: 'US',
        name: 'United States',
      },
    ],
    releaseDate: '2014-11-07',
    revenue: 701729206,
    runtime: 169,
    spokenLanguages: [
      {
        code: 'en',
        englishName: 'English',
        name: 'English',
      },
    ],
    status: 'Released',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    title: 'Interstellar',
    video: false,
    voteAverage: 8.7,
    voteCount: 36000,
    ...overrides,
  }
}

function renderMovieDetails(initialEntry = '/movies/157336?query=dune&language=en-US&page=2&includeAdult=false&region=&year=&primaryReleaseYear=') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<MovieDetails />} path="/movies/:movieId" />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MovieDetails', () => {
  it('renders the centered loading state while details are being fetched', () => {
    vi.mocked(useMovieDetails).mockReturnValue({
      error: null,
      movie: null,
      retry: vi.fn(),
      status: 'loading',
    })

    renderMovieDetails()

    expect(screen.getByText('Loading movie details...')).toBeInTheDocument()
  })

  it('renders the error state and retries on demand', () => {
    const retry = vi.fn()

    vi.mocked(useMovieDetails).mockReturnValue({
      error: 'No internet connection. Check your connection and try again.',
      movie: null,
      retry,
      status: 'error',
    })

    renderMovieDetails()

    expect(screen.getByText('Movie details unavailable')).toBeInTheDocument()
    expect(
      screen.getByText('No internet connection. Check your connection and try again.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '← Back to search' })).toHaveAttribute(
      'href',
      '/?query=dune&language=en-US&page=2&includeAdult=false&region=&year=&primaryReleaseYear=',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(retry).toHaveBeenCalledOnce()
  })

  it('renders movie content and primary actions after a successful response', () => {
    vi.mocked(useMovieDetails).mockReturnValue({
      error: null,
      movie: createMovie(),
      retry: vi.fn(),
      status: 'success',
    })

    renderMovieDetails()

    expect(screen.getByRole('heading', { name: 'Interstellar' })).toBeInTheDocument()
    expect(
      screen.getByText('Explorers travel through a wormhole in space.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Official site' })).toHaveAttribute(
      'href',
      'https://example.com/interstellar',
    )
    expect(screen.getByRole('link', { name: 'View on IMDb' })).toHaveAttribute(
      'href',
      'https://www.imdb.com/title/tt0816692',
    )
  })
})
