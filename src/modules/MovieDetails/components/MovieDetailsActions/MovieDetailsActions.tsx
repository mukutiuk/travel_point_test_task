import { Button } from "@/UIKit/Button";
import type { MovieDetails as MovieDetailsEntity } from "@/modules/MovieDetails/entity/dto/movieDetails.entity";
import styles from "./MovieDetailsActions.module.css";

const IMDB_TITLE_URL = "https://www.imdb.com/title/";

interface MovieDetailsActionsProps {
  movie: MovieDetailsEntity;
}

export function MovieDetailsActions({ movie }: MovieDetailsActionsProps) {
  return (
    <div className={styles.actions}>
      {movie.homepage ? (
        <a
          className={styles.link}
          href={movie.homepage}
          rel="noreferrer"
          target="_blank"
        >
          <Button as="span">Official site</Button>
        </a>
      ) : null}
      {movie.imdbId ? (
        <a
          className={styles.link}
          href={`${IMDB_TITLE_URL}${movie.imdbId}`}
          rel="noreferrer"
          target="_blank"
        >
          <Button as="span">View on IMDb</Button>
        </a>
      ) : null}
    </div>
  );
}
