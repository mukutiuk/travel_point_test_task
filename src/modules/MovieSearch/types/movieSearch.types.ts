import type {
  AsyncStatus,
  Nullable,
} from "@/modules/MovieSearch/types/common.types";
import type {
  Movie,
  MovieGenreMap,
} from "@/modules/MovieSearch/entity/dto/movieSearch";

export interface MovieSearchFilters {
  includeAdult: boolean;
  language: string;
  page: number;
  primaryReleaseYear: string;
  region: string;
  year: string;
}

export interface MovieSearchState {
  filters: MovieSearchFilters;
  query: string;
}

export interface MovieSearchResultState {
  error: Nullable<Error>;
  executedQuery: string;
  movies: Movie[];
  status: AsyncStatus;
  totalPages: number;
  totalResults: number;
}

export interface UseMovieSearchResult extends MovieSearchResultState {
  changePage: (page: number) => void;
  changeQuery: (nextQuery: string) => void;
  clearHistory: () => void;
  debouncedQuery: string;
  filters: MovieSearchFilters;
  genresById: MovieGenreMap;
  hasMovies: boolean;
  historyTerms: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  isWaitingForDebounce: boolean;
  query: string;
  retry: () => void;
  selectQuery: (nextQuery: string) => void;
  submitQuery: () => void;
  updateFilters: (nextFilters: Partial<MovieSearchFilters>) => void;
}
