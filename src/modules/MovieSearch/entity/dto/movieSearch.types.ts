export interface GenreDto {
  id: number
  name: string
}

export interface GenresResponseDto {
  genres: GenreDto[]
}

export interface MovieDto {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface SearchMoviesParamsDto {
  include_adult?: boolean
  language?: string
  page?: number
  primary_release_year?: number
  query: string
  region?: string
  year?: number
}

export interface SearchMoviesResponseDto {
  page: number
  results: MovieDto[]
  total_pages: number
  total_results: number
}
