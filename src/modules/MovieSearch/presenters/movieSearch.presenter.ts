import { buildMovieImageUrl } from "@/modules/MovieSearch/entity/movieImage";
import { MOVIE_SEARCH_MIN_QUERY_LENGTH } from "@/modules/MovieSearch/constants/movieSearch.constants";

import type { Movie, MovieGenreMap } from "../entity/dto/movieSearch";
import type {
  AutocompleteDropdownItem,
  AutocompleteDropdownViewModel,
} from "../components/AutocompleteDropdown";
import type { MovieCardProps } from "../components/MovieCard";

function formatMovieYear(releaseDate: string) {
  if (!releaseDate) {
    return "TBA";
  }

  return new Date(releaseDate).getFullYear().toString();
}

function formatMovieRating(voteAverage: number) {
  if (!voteAverage) {
    return "N/A";
  }

  return voteAverage.toFixed(1);
}

function mapGenreIdsToNames(movie: Movie, genresById: MovieGenreMap) {
  return movie.genreIds
    .map((genreId) => genresById[genreId])
    .filter((genreName): genreName is string => Boolean(genreName));
}

function mapMovieToAutocompleteItem(
  movie: Movie,
  genresById: MovieGenreMap,
): AutocompleteDropdownItem {
  const genreNames = mapGenreIdsToNames(movie, genresById);

  return {
    id: movie.id,
    posterUrl: buildMovieImageUrl(movie.posterPath, "w185"),
    subtitle: `${formatMovieYear(movie.releaseDate)}${genreNames.length ? ` • ${genreNames.slice(0, 2).join(", ")}` : ""}`,
    title: movie.title,
    value: movie.title,
  };
}

export function createAutocompleteViewModel({
  error,
  historyTerms,
  isLoading,
  movies,
  query,
  genresById,
}: {
  error: string | null;
  genresById: MovieGenreMap;
  historyTerms: string[];
  isLoading: boolean;
  movies: Movie[];
  query: string;
}): AutocompleteDropdownViewModel {
  const trimmedQuery = query.trim();
  const showHistory =
    trimmedQuery.length < MOVIE_SEARCH_MIN_QUERY_LENGTH &&
    historyTerms.length > 0;

  if (showHistory) {
    return {
      items: historyTerms.map((term) => ({
        id: term,
        posterUrl: null,
        subtitle: "Recent search",
        title: term,
        value: term,
      })),
      showClearHistory: true,
      statusMessage: null,
    };
  }

  if (trimmedQuery.length < MOVIE_SEARCH_MIN_QUERY_LENGTH) {
    return {
      items: [],
      showClearHistory: false,
      statusMessage: null,
    };
  }

  if (isLoading) {
    return {
      items: [],
      showClearHistory: false,
      statusMessage: "Loading suggestions...",
    };
  }

  if (error) {
    return {
      items: [],
      showClearHistory: false,
      statusMessage: error,
    };
  }

  const items = movies
    .slice(0, 6)
    .map((movie) => mapMovieToAutocompleteItem(movie, genresById));

  return {
    items,
    showClearHistory: false,
    statusMessage: items.length === 0 ? "No quick matches yet." : null,
  };
}

export function mapMoviesToCardProps(
  movies: Movie[],
  genresById: MovieGenreMap,
  searchQueryString: string,
): MovieCardProps[] {
  return movies.map((movie) => ({
    genres: mapGenreIdsToNames(movie, genresById).slice(0, 3),
    href: `/movies/${movie.id}?${searchQueryString}`,
    overview:
      movie.overview || "No overview has been published for this title yet.",
    posterUrl: buildMovieImageUrl(movie.posterPath, "w500"),
    rating: formatMovieRating(movie.voteAverage),
    title: movie.title,
    year: formatMovieYear(movie.releaseDate),
  }));
}

export function formatResultsCount(totalResults: number) {
  return `${new Intl.NumberFormat("en-US").format(totalResults)} movies found`;
}
