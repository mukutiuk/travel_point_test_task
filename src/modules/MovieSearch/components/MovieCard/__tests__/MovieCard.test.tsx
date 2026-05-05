import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MovieCard } from '@/modules/MovieSearch/components/MovieCard'

describe('MovieCard', () => {
  it('renders movie information and link to details page', () => {
    render(
      <MemoryRouter>
        <MovieCard
          genres={['Action', 'Sci-Fi']}
          href="/movies/11?query=interstellar&language=en-US&page=1&includeAdult=false&region=&year=&primaryReleaseYear="
          overview="Explorers travel through a wormhole in space."
          posterUrl={null}
          rating="8.5"
          title="Interstellar"
          year="2014"
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Open details for Interstellar' })).toHaveAttribute(
      'href',
      '/movies/11?query=interstellar&language=en-US&page=1&includeAdult=false&region=&year=&primaryReleaseYear=',
    )
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
  })
})
