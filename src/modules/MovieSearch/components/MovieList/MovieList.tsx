import { memo } from "react";
import { MovieCard } from "../MovieCard";
import styles from "./MovieList.module.css";
import type { MovieListProps } from "./MovieList.types";

export const MovieList = memo(function MovieList({ movies }: MovieListProps) {
  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.href} {...movie} />
      ))}
    </div>
  );
});
