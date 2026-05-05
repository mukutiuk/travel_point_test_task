import { httpClient } from "@/lib/api/httpClient";
import {
  mapGenreDtoToEntity,
  mapGenresToMovieGenreMap,
  mapMovieSearchResponseToEntity,
} from "@/modules/MovieSearch/entity/movieSearch.mapper";
import type {
  GenresResponseDto,
  SearchMoviesParamsDto,
  SearchMoviesResponseDto,
} from "@/modules/MovieSearch/entity/dto/movieSearch.types";
import type { MovieGenreMap } from "./dto/movieSearch";
import { MOVIE_SEARCH_ENDPOINTS } from "./movieLinks";

const genreCache = new Map<string, MovieGenreMap>();

export async function searchMovies(
  params: SearchMoviesParamsDto,
  signal?: AbortSignal,
) {
  const { data } = await httpClient.get<SearchMoviesResponseDto>(
    MOVIE_SEARCH_ENDPOINTS.searchMovies,
    {
      params,
      signal,
    },
  );

  return mapMovieSearchResponseToEntity(data);
}

export async function fetchMovieGenres(
  language = "en-US",
  signal?: AbortSignal,
) {
  const cachedGenres = genreCache.get(language);

  if (cachedGenres) {
    return cachedGenres;
  }

  const { data } = await httpClient.get<GenresResponseDto>(
    MOVIE_SEARCH_ENDPOINTS.movieGenres,
    {
      params: {
        language,
      },
      signal,
    },
  );

  const genreMap = mapGenresToMovieGenreMap(
    data.genres.map(mapGenreDtoToEntity),
  );
  genreCache.set(language, genreMap);

  return genreMap;
}
