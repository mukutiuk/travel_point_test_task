import { APP_ENV } from "@/config";
import type { Nullable } from "@/modules/MovieSearch/types/common.types";

export type MovieImageSize = "original" | "w185" | "w342" | "w500" | "w780";

export function buildMovieImageUrl(
  path: Nullable<string>,
  size: MovieImageSize = "w500",
) {
  if (!path) {
    return null;
  }

  return `${APP_ENV.tmdbImageBaseUrl}/${size}${path}`;
}
