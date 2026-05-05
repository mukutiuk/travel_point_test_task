import type { Nullable } from "@/modules/MovieSearch/types/common.types";

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCountry {
  code: string;
  name: string;
}

export interface SpokenLanguage {
  code: string;
  englishName: string;
  name: string;
}

export interface MovieDetails {
  adult: boolean;
  backdropPath: Nullable<string>;
  budget: number;
  genres: Genre[];
  homepage: Nullable<string>;
  id: number;
  imdbId: Nullable<string>;
  originCountries: string[];
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: Nullable<string>;
  productionCountries: ProductionCountry[];
  releaseDate: string;
  revenue: number;
  runtime: Nullable<number>;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

export function isValidMovieId(movieId: number | null): movieId is number {
  return Number.isFinite(movieId) && Boolean(movieId && movieId > 0);
}
