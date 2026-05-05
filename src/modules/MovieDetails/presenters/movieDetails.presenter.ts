import { formatDate } from "@/lib/formatDate";
import { type MovieDetails } from "@/modules/MovieDetails/entity/dto/movieDetails.entity";
import { buildMovieImageUrl } from "@/modules/MovieSearch/entity/movieImage";

export interface MovieDetailsViewModel {
  backdropUrl: string | null;
  budgetLabel: string;
  countriesLabel: string;
  languagesLabel: string;
  popularityLabel: string;
  posterUrl: string | null;
  ratingLabel: string;
  releaseDateLabel: string;
  revenueLabel: string;
  runtimeLabel: string;
  votesLabel: string;
}

function formatCurrency(amount: number) {
  if (!amount) {
    return "Not disclosed";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function formatRuntime(runtime: number | null) {
  if (!runtime) {
    return "Unknown runtime";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) {
    return `${minutes}m`;
  }

  if (!minutes) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

function formatVote(voteAverage: number) {
  if (!voteAverage) {
    return "N/A";
  }

  return voteAverage.toFixed(1);
}

export function buildMovieDetailsViewModel(
  movie: MovieDetails,
  language: string,
): MovieDetailsViewModel {
  return {
    backdropUrl: buildMovieImageUrl(movie.backdropPath, "original"),
    budgetLabel: formatCurrency(movie.budget),
    countriesLabel: movie.productionCountries.length
      ? movie.productionCountries.map((item) => item.name).join(", ")
      : "Unknown",
    languagesLabel: movie.spokenLanguages.length
      ? movie.spokenLanguages.map((item) => item.englishName).join(", ")
      : "Unknown",
    popularityLabel: movie.popularity.toFixed(0),
    posterUrl: buildMovieImageUrl(movie.posterPath, "w500"),
    ratingLabel: formatVote(movie.voteAverage),
    releaseDateLabel: formatDate(movie.releaseDate, language),
    revenueLabel: formatCurrency(movie.revenue),
    runtimeLabel: formatRuntime(movie.runtime),
    votesLabel: movie.voteCount.toString(),
  };
}
