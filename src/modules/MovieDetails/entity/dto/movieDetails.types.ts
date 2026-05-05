export interface GenreDto {
  id: number
  name: string
}

export interface ProductionCountryDto {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguageDto {
  english_name: string
  iso_639_1: string
  name: string
}

export interface MovieDetailsDto {
  adult: boolean
  backdrop_path: string | null
  budget: number
  genres: GenreDto[]
  homepage: string | null
  id: number
  imdb_id: string | null
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  production_countries: ProductionCountryDto[]
  release_date: string
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguageDto[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}
