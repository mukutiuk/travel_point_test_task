import { httpClient } from "@/lib/api/httpClient";
import { mapMovieDetailsDtoToEntity } from "./movieDetails.mapper";
import type { MovieDetailsDto } from "./dto/movieDetails.types";

function buildMovieDetailsEndpoint(movieId: number) {
  return `/movie/${movieId}`;
}

export async function fetchMovieDetails(
  movieId: number,
  language = "en-US",
  signal?: AbortSignal,
) {
  const { data } = await httpClient.get<MovieDetailsDto>(
    buildMovieDetailsEndpoint(movieId),
    {
      params: {
        language,
      },
      signal,
    },
  );

  return mapMovieDetailsDtoToEntity(data);
}
