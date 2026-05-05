import { DEFAULT_MOVIE_SEARCH_FILTERS } from '@/modules/MovieSearch/constants/movieSearch.constants'
import type {
  MovieSearchFilters,
  MovieSearchState,
} from '@/modules/MovieSearch/types/movieSearch.types'

function parsePositiveNumber(value: string | null, fallbackValue: number) {
  if (!value) {
    return fallbackValue
  }

  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return fallbackValue
  }

  return parsedValue
}

function parseBoolean(value: string | null, fallbackValue: boolean) {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return fallbackValue
}

function withDefaults(filters: Partial<MovieSearchFilters>): MovieSearchFilters {
  return {
    ...DEFAULT_MOVIE_SEARCH_FILTERS,
    ...filters,
  }
}

export function parseMovieSearchState(searchParams: URLSearchParams): MovieSearchState {
  return {
    filters: withDefaults({
      includeAdult: parseBoolean(
        searchParams.get('includeAdult'),
        DEFAULT_MOVIE_SEARCH_FILTERS.includeAdult,
      ),
      language: searchParams.get('language') ?? DEFAULT_MOVIE_SEARCH_FILTERS.language,
      page: parsePositiveNumber(searchParams.get('page'), DEFAULT_MOVIE_SEARCH_FILTERS.page),
      primaryReleaseYear: searchParams.get('primaryReleaseYear') ?? '',
      region: searchParams.get('region') ?? '',
      year: searchParams.get('year') ?? '',
    }),
    query: searchParams.get('query') ?? '',
  }
}

export function createMovieSearchParams(query: string, filters: MovieSearchFilters) {
  const searchParams = new URLSearchParams()

  searchParams.set('query', query)
  searchParams.set('language', filters.language)
  searchParams.set('page', String(filters.page))
  searchParams.set('includeAdult', String(filters.includeAdult))
  searchParams.set('region', filters.region)
  searchParams.set('year', filters.year)
  searchParams.set('primaryReleaseYear', filters.primaryReleaseYear)

  return searchParams
}

export function createMovieSearchQueryString(query: string, filters: MovieSearchFilters) {
  return createMovieSearchParams(query, filters).toString()
}
