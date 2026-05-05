import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  searchMovies,
  fetchMovieGenres,
} from "@/modules/MovieSearch/entity/movieSearch.api";
import {
  MOVIE_SEARCH_DEBOUNCE_MS,
  MOVIE_SEARCH_MIN_QUERY_LENGTH,
} from "@/modules/MovieSearch/constants/movieSearch.constants";
import {
  createMovieSearchParams,
  parseMovieSearchState,
} from "@/modules/MovieSearch/schemas/movieSearch.searchParams";
import type {
  MovieSearchFilters,
  MovieSearchResultState,
  UseMovieSearchResult,
} from "@/modules/MovieSearch/types/movieSearch.types";
import { useMovieSearchHistory } from "@/modules/MovieSearch/presenters/SearchHistoryContext";
import { debounce } from "@/lib/debounce";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { MovieGenreMap } from "../entity/dto/movieSearch";
import type { SearchMoviesParamsDto } from "../entity/dto/movieSearch.types";

function createInitialSearchState(): MovieSearchResultState {
  return {
    error: null,
    executedQuery: "",
    movies: [],
    status: "idle",
    totalPages: 0,
    totalResults: 0,
  };
}

function createPendingSearchState(executedQuery: string): MovieSearchResultState {
  return {
    ...createInitialSearchState(),
    executedQuery,
    status: "loading",
  };
}

const initialSearchState = createInitialSearchState();

function getPendingStatus(
  hasMovies: boolean,
): Extract<MovieSearchResultState["status"], "loading" | "refreshing"> {
  return hasMovies ? "refreshing" : "loading";
}

function createSearchError(error: unknown, fallbackMessage: string) {
  return new Error(getErrorMessage(error, fallbackMessage));
}

function resetToFirstPage(filters: MovieSearchFilters) {
  if (filters.page === 1) {
    return filters;
  }

  return {
    ...filters,
    page: 1,
  };
}

function createSearchParams(
  query: string,
  filters: MovieSearchFilters,
): SearchMoviesParamsDto {
  return {
    include_adult: filters.includeAdult,
    language: filters.language,
    page: filters.page,
    primary_release_year: filters.primaryReleaseYear
      ? Number(filters.primaryReleaseYear)
      : undefined,
    query,
    region: filters.region || undefined,
    year: filters.year ? Number(filters.year) : undefined,
  };
}

export function useMovieSearch(): UseMovieSearchResult {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [initialStateFromUrl] = useState(() =>
    parseMovieSearchState(urlSearchParams),
  );
  const [query, setQuery] = useState(initialStateFromUrl.query);
  const [filters, setFilters] = useState(initialStateFromUrl.filters);
  const [debouncedQuery, setDebouncedQuery] = useState(
    initialStateFromUrl.query.trim(),
  );
  const [retryKey, setRetryKey] = useState(0);
  const [searchState, setSearchState] =
    useState<MovieSearchResultState>(initialSearchState);
  const activeRequestIdReference = useRef(0);
  const [genresById, setGenresById] = useState<MovieGenreMap>({});
  const { addTerm, clearHistory, terms } = useMovieSearchHistory();

  const normalizedQuery = query.trim();
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const hasActiveQuery =
    normalizedQuery.length >= MOVIE_SEARCH_MIN_QUERY_LENGTH;
  const isQueryReady =
    trimmedDebouncedQuery.length >= MOVIE_SEARCH_MIN_QUERY_LENGTH;
  const isWaitingForDebounce =
    hasActiveQuery && normalizedQuery !== trimmedDebouncedQuery;

  useEffect(() => {
    return debounce(() => {
      setDebouncedQuery(normalizedQuery);
    }, MOVIE_SEARCH_DEBOUNCE_MS);
  }, [normalizedQuery]);

  useEffect(() => {
    const nextSearchParams = createMovieSearchParams(query, filters);
    const nextQueryString = nextSearchParams.toString();
    const currentQueryString = urlSearchParams.toString();

    if (nextQueryString === currentQueryString) {
      return;
    }

    setUrlSearchParams(nextSearchParams, { replace: true });
  }, [filters, query, setUrlSearchParams, urlSearchParams]);

  useEffect(() => {
    const controller = new AbortController();

    fetchMovieGenres(filters.language, controller.signal)
      .then((movieGenresById) => {
        setGenresById(movieGenresById);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setGenresById({});
        }
      });

    return () => {
      controller.abort();
    };
  }, [filters.language]);

  useEffect(() => {
    if (!isQueryReady || isWaitingForDebounce) {
      return;
    }

    const controller = new AbortController();
    const requestId = activeRequestIdReference.current + 1;
    activeRequestIdReference.current = requestId;

    setSearchState((currentState) => ({
      error: null,
      executedQuery: trimmedDebouncedQuery,
      movies:
        currentState.executedQuery === trimmedDebouncedQuery
          ? currentState.movies
          : [],
      status: getPendingStatus(
        currentState.executedQuery === trimmedDebouncedQuery &&
          currentState.movies.length > 0,
      ),
      totalPages:
        currentState.executedQuery === trimmedDebouncedQuery
          ? currentState.totalPages
          : 0,
      totalResults:
        currentState.executedQuery === trimmedDebouncedQuery
          ? currentState.totalResults
          : 0,
    }));

    async function runSearch() {
      try {
        const response = await searchMovies(
          createSearchParams(trimmedDebouncedQuery, filters),
          controller.signal,
        );

        if (
          controller.signal.aborted ||
          requestId !== activeRequestIdReference.current
        ) {
          return;
        }

        setSearchState({
          error: null,
          executedQuery: trimmedDebouncedQuery,
          movies: response.movies,
          status: response.movies.length ? "success" : "empty",
          totalPages: response.totalPages,
          totalResults: response.totalResults,
        });
      } catch (error: unknown) {
        if (
          controller.signal.aborted ||
          requestId !== activeRequestIdReference.current
        ) {
          return;
        }

        const searchError = createSearchError(
          error,
          "Unable to load movies right now.",
        );

        setSearchState((currentState) => ({
          ...currentState,
          error: searchError,
          executedQuery: trimmedDebouncedQuery,
          status: "error",
        }));
      }
    }

    void runSearch();

    return () => {
      controller.abort();
    };
  }, [
    filters,
    isQueryReady,
    isWaitingForDebounce,
    retryKey,
    trimmedDebouncedQuery,
  ]);

  useEffect(() => {
    if (
      (searchState.status === "success" || searchState.status === "empty") &&
      searchState.executedQuery.length >= MOVIE_SEARCH_MIN_QUERY_LENGTH
    ) {
      addTerm(searchState.executedQuery);
    }
  }, [addTerm, searchState.executedQuery, searchState.status]);

  function applyQuery(nextQuery: string) {
    const normalizedNextQuery = nextQuery.trim();

    setQuery(nextQuery);
    setFilters((currentFilters) => resetToFirstPage(currentFilters));

    if (normalizedNextQuery === normalizedQuery) {
      return;
    }

    activeRequestIdReference.current += 1;

    if (normalizedNextQuery.length < MOVIE_SEARCH_MIN_QUERY_LENGTH) {
      setDebouncedQuery(normalizedNextQuery);
    }

    setSearchState(createInitialSearchState());
  }

  function updateFilters(nextFilters: Partial<MovieSearchFilters>) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
      page: "page" in nextFilters ? (nextFilters.page ?? 1) : 1,
    }));
  }

  function changePage(page: number) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page,
    }));
  }

  function submitQuery() {
    if (normalizedQuery.length < MOVIE_SEARCH_MIN_QUERY_LENGTH) {
      return;
    }

    if (normalizedQuery === trimmedDebouncedQuery) {
      setRetryKey((currentRetryKey) => currentRetryKey + 1);
      return;
    }

    setDebouncedQuery(normalizedQuery);
  }

  const retry = () => {
    setSearchState((currentState) => ({
      ...currentState,
      error: null,
      status: getPendingStatus(currentState.movies.length > 0),
    }));
    setRetryKey((currentRetryKey) => currentRetryKey + 1);
  };

  const sharedResult = {
    changePage,
    changeQuery: applyQuery,
    clearHistory,
    debouncedQuery: trimmedDebouncedQuery,
    filters,
    genresById,
    historyTerms: terms,
    query,
    retry,
    selectQuery: applyQuery,
    submitQuery,
    updateFilters,
  };

  if (!hasActiveQuery) {
    return {
      ...createInitialSearchState(),
      ...sharedResult,
      hasMovies: false,
      isLoading: false,
      isRefreshing: false,
      isWaitingForDebounce: false,
    };
  }

  const publicState =
    isWaitingForDebounce
      ? createInitialSearchState()
      : searchState.executedQuery === trimmedDebouncedQuery
        ? searchState
        : createPendingSearchState(trimmedDebouncedQuery);

  return {
    ...publicState,
    ...sharedResult,
    hasMovies: publicState.movies.length > 0,
    isLoading: publicState.status === "loading",
    isRefreshing: publicState.status === "refreshing",
    isWaitingForDebounce,
  };
}
