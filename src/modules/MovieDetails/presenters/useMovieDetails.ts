import { useEffect, useState } from "react";
import {
  isValidMovieId,
  type MovieDetails,
} from "@/modules/MovieDetails/entity/dto/movieDetails.entity";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { Nullable } from "@/modules/MovieSearch/types/common.types";
import { fetchMovieDetails } from "../entity/movieDetails.api";

interface UseMovieDetailsState {
  error: Nullable<string>;
  movie: Nullable<MovieDetails>;
  status: "error" | "idle" | "loading" | "success";
}

const initialState: UseMovieDetailsState = {
  error: null,
  movie: null,
  status: "idle",
};

export function useMovieDetails(movieId: number | null, language: string) {
  const [requestSeed, setRequestSeed] = useState(0);
  const [state, setState] = useState<UseMovieDetailsState>(initialState);

  useEffect(() => {
    if (!isValidMovieId(movieId)) {
      return;
    }

    const controller = new AbortController();

    setState({
      error: null,
      movie: null,
      status: "loading",
    });

    fetchMovieDetails(movieId, language, controller.signal)
      .then((movie) => {
        setState({
          error: null,
          movie,
          status: "success",
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          error: getErrorMessage(
            error,
            "Unable to load movie details right now.",
          ),
          movie: null,
          status: "error",
        });
      });

    return () => {
      controller.abort();
    };
  }, [language, movieId, requestSeed]);

  const retry = () => setRequestSeed((currentSeed) => currentSeed + 1);

  if (!isValidMovieId(movieId)) {
    return {
      error: "Movie id is missing or invalid.",
      movie: null,
      retry,
      status: "error" as const,
    };
  }

  return {
    ...state,
    retry,
  };
}
