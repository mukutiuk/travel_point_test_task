import type { Nullable } from "@/modules/MovieSearch/types/common.types";

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  adult: boolean;
  backdropPath: Nullable<string>;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: Nullable<string>;
  releaseDate: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

export interface MovieSearchResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export type MovieGenreMap = Record<number, string>;
