import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

import { useClickOutside } from "@/hooks/useClickOutside";
import {
  MOVIE_SEARCH_LANGUAGE_OPTIONS,
  MOVIE_SEARCH_MIN_QUERY_LENGTH,
  MOVIE_SEARCH_REGION_OPTIONS,
} from "@/modules/MovieSearch/constants/movieSearch.constants";
import {
  createAutocompleteViewModel,
  formatResultsCount,
  mapMoviesToCardProps,
} from "@/modules/MovieSearch/presenters/movieSearch.presenter";
import type { AutocompleteDropdownProps } from "../components/AutocompleteDropdown/AutocompleteDropdown.types";
import type { MovieListProps } from "../components/MovieList/MovieList.types";
import type { PaginationProps } from "../components/Pagination/Pagination.types";
import type { SearchInputProps } from "../components/SearchInput/SearchInput.types";
import { useMovieSearch } from "./useMovieSearch";
import type { MovieFiltersProps } from "../components/MovieFilters";
import { createMovieSearchQueryString } from "../schemas/movieSearch.searchParams";

function shouldOpenAutocomplete(query: string, historyTermsCount: number) {
  return (
    query.trim().length >= MOVIE_SEARCH_MIN_QUERY_LENGTH ||
    historyTermsCount > 0
  );
}

interface UseMovieSearchViewResult {
  autocompleteDropdownProps: AutocompleteDropdownProps;
  hasMovies: boolean;
  movieFiltersProps: MovieFiltersProps;
  movieListProps: MovieListProps;
  paginationProps: PaginationProps;
  progressVisible: boolean;
  resultsCountLabel: string;
  searchError: Error | null;
  resultsRequestKey: string;
  resultsReference: RefObject<HTMLElement | null>;
  retryResults: () => void;
  searchContainerReference: RefObject<HTMLDivElement | null>;
  searchInputProps: SearchInputProps;
  showEmptyState: boolean;
  showErrorState: boolean;
  showRefreshingState: boolean;
  showResultsSection: boolean;
  showSkeleton: boolean;
}

export function useMovieSearchView(): UseMovieSearchViewResult {
  const searchContainerReference = useRef<HTMLDivElement>(null);
  const resultsReference = useRef<HTMLElement>(null);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const movieSearch = useMovieSearch();

  const canOpenAutocomplete = shouldOpenAutocomplete(
    movieSearch.query,
    movieSearch.historyTerms.length,
  );
  const hasActiveSearchQuery =
    movieSearch.query.trim().length >= MOVIE_SEARCH_MIN_QUERY_LENGTH;

  const closeAutocomplete = useCallback(() => {
    setIsAutocompleteOpen(false);
  }, []);

  const blurSearchInput = useCallback(() => {
    searchContainerReference.current
      ?.querySelector<HTMLInputElement>('input[type="search"]')
      ?.blur();
  }, []);

  useClickOutside(searchContainerReference, closeAutocomplete);

  useEffect(() => {
    document.title = "TMDB Movie Search";
  }, []);

  const autocompleteViewModel = useMemo(
    () =>
      createAutocompleteViewModel({
        error:
          movieSearch.status === "error" && movieSearch.movies.length === 0
            ? movieSearch.error?.message ?? null
            : null,
        genresById: movieSearch.genresById,
        historyTerms: movieSearch.historyTerms,
        isLoading:
          canOpenAutocomplete &&
          (movieSearch.isWaitingForDebounce ||
            movieSearch.isLoading ||
            movieSearch.isRefreshing),
        movies: movieSearch.movies,
        query: movieSearch.query,
      }),
    [
      canOpenAutocomplete,
      movieSearch.error,
      movieSearch.genresById,
      movieSearch.historyTerms,
      movieSearch.isLoading,
      movieSearch.isRefreshing,
      movieSearch.isWaitingForDebounce,
      movieSearch.movies,
      movieSearch.query,
      movieSearch.status,
    ],
  );

  const resultsRequestKey = useMemo(
    () => createMovieSearchQueryString(movieSearch.query, movieSearch.filters),
    [movieSearch.filters, movieSearch.query],
  );

  const movieCards = useMemo(
    () =>
      mapMoviesToCardProps(
        movieSearch.movies,
        movieSearch.genresById,
        resultsRequestKey,
      ),
    [
      movieSearch.genresById,
      movieSearch.movies,
      resultsRequestKey,
    ],
  );

  const resultsCountLabel = useMemo(
    () =>
      hasActiveSearchQuery &&
      !movieSearch.isWaitingForDebounce &&
      (movieSearch.status === "success" || movieSearch.status === "empty")
        ? formatResultsCount(movieSearch.totalResults)
        : "",
    [
      hasActiveSearchQuery,
      movieSearch.isWaitingForDebounce,
      movieSearch.status,
      movieSearch.totalResults,
    ],
  );
  const handleSearchChange = useCallback(
    (nextValue: string) => {
      movieSearch.changeQuery(nextValue);
      setIsAutocompleteOpen(
        shouldOpenAutocomplete(nextValue, movieSearch.historyTerms.length),
      );
    },
    [movieSearch],
  );

  const handleSearchFocus = useCallback(() => {
    if (canOpenAutocomplete) {
      setIsAutocompleteOpen(true);
    }
  }, [canOpenAutocomplete]);

  const handleSearchSubmit = useCallback(() => {
    movieSearch.submitQuery();
    setIsAutocompleteOpen(false);
  }, [movieSearch]);

  const handleSuggestionSelect = useCallback(
    (value: string) => {
      movieSearch.selectQuery(value);
      setIsAutocompleteOpen(false);
      blurSearchInput();
    },
    [blurSearchInput, movieSearch],
  );

  const handleToggleFilters = useCallback(() => {
    setIsFiltersOpen((currentState) => !currentState);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      movieSearch.changePage(page);
      resultsReference.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [movieSearch],
  );

  const showAutocomplete = isAutocompleteOpen && canOpenAutocomplete;
  const showSkeleton =
    hasActiveSearchQuery &&
    (movieSearch.isWaitingForDebounce || movieSearch.isLoading);
  const showRefreshingState =
    hasActiveSearchQuery && movieSearch.isRefreshing && movieSearch.hasMovies;
  const showResultsSection = hasActiveSearchQuery;

  return {
    autocompleteDropdownProps: {
      isOpen: showAutocomplete,
      items: autocompleteViewModel.items,
      onClearHistory: movieSearch.clearHistory,
      onSelect: handleSuggestionSelect,
      showClearHistory: autocompleteViewModel.showClearHistory,
      statusMessage: autocompleteViewModel.statusMessage,
    },
    hasMovies: movieSearch.hasMovies,
    movieFiltersProps: {
      filters: movieSearch.filters,
      isOpen: isFiltersOpen,
      languageOptions: MOVIE_SEARCH_LANGUAGE_OPTIONS,
      onChange: movieSearch.updateFilters,
      onToggle: handleToggleFilters,
      regionOptions: MOVIE_SEARCH_REGION_OPTIONS,
    },
    movieListProps: {
      movies: movieCards,
    },
    paginationProps: {
      currentPage: movieSearch.filters.page,
      onPageChange: handlePageChange,
      totalPages: movieSearch.totalPages,
    },
    progressVisible:
      hasActiveSearchQuery &&
      (movieSearch.isLoading || movieSearch.isRefreshing),
    resultsCountLabel,
    searchError: movieSearch.error,
    resultsRequestKey,
    resultsReference,
    retryResults: movieSearch.retry,
    searchContainerReference,
    searchInputProps: {
      onChange: handleSearchChange,
      onFocus: handleSearchFocus,
      onHideSuggestions: closeAutocomplete,
      onSubmit: handleSearchSubmit,
      value: movieSearch.query,
    },
    showEmptyState:
      hasActiveSearchQuery && !showSkeleton && movieSearch.status === "empty",
    showErrorState:
      hasActiveSearchQuery && !showSkeleton && movieSearch.status === "error",
    showRefreshingState,
    showResultsSection,
    showSkeleton,
  };
}
