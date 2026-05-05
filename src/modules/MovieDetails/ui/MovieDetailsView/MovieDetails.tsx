import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MovieDetailsContent } from "@/modules/MovieDetails/components/MovieDetailsContent";
import { MovieDetailsError } from "@/modules/MovieDetails/components/MovieDetailsError";
import { MovieDetailsLoading } from "@/modules/MovieDetails/components/MovieDetailsLoading";
import { useMovieDetails } from "../../presenters/useMovieDetails";
import { buildMovieDetailsViewModel } from "../../presenters/movieDetails.presenter";
import { parseMovieSearchState } from "@/modules/MovieSearch/schemas/movieSearch.searchParams";

export function MovieDetails() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const parsedMovieId = Number(movieId);
  const persistedSearchState = parseMovieSearchState(searchParams);
  const language = persistedSearchState.filters.language;
  const backToSearchUrl = searchParams.toString()
    ? `/?${searchParams.toString()}`
    : "/";
  const { error, movie, retry, status } = useMovieDetails(
    parsedMovieId,
    language,
  );

  useEffect(() => {
    document.title = movie
      ? `${movie.title} | TMDB Movie Search`
      : "Movie Details";
  }, [movie]);

  if (status === "loading" || status === "idle") {
    return <MovieDetailsLoading />;
  }

  if (status === "error" || !movie) {
    return (
      <MovieDetailsError
        backToSearchUrl={backToSearchUrl}
        message={error ?? "Unable to load this movie."}
        onRetry={retry}
      />
    );
  }

  const viewModel = buildMovieDetailsViewModel(movie, language);

  return (
    <MovieDetailsContent
      backToSearchUrl={backToSearchUrl}
      movie={movie}
      viewModel={viewModel}
    />
  );
}
