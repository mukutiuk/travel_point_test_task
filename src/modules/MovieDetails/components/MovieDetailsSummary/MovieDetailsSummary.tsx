import type { MovieDetails as MovieDetailsEntity } from "@/modules/MovieDetails/entity/dto/movieDetails.entity";
import type { MovieDetailsViewModel } from "@/modules/MovieDetails/presenters/movieDetails.presenter";
import styles from "./MovieDetailsSummary.module.css";

interface MovieDetailsSummaryProps {
  movie: MovieDetailsEntity;
  viewModel: MovieDetailsViewModel;
}

export function MovieDetailsSummary({
  movie,
  viewModel,
}: MovieDetailsSummaryProps) {
  return (
    <>
      <div className={styles.topMeta}>
        <span className={styles.metaItem}>{viewModel.releaseDateLabel}</span>
        <span className={styles.metaItem}>{viewModel.runtimeLabel}</span>
        <span className={styles.metaItem}>{movie.status}</span>
      </div>

      <h1 className={styles.title}>{movie.title}</h1>
      {movie.tagline ? (
        <p className={styles.tagline}>{movie.tagline}</p>
      ) : null}

      <div className={styles.highlights}>
        <div className={styles.highlight}>
          <span className={styles.highlightLabel}>TMDB rating</span>
          <strong className={styles.highlightValue}>{viewModel.ratingLabel}</strong>
        </div>
        <div className={styles.highlight}>
          <span className={styles.highlightLabel}>Popularity</span>
          <strong className={styles.highlightValue}>
            {viewModel.popularityLabel}
          </strong>
        </div>
        <div className={styles.highlight}>
          <span className={styles.highlightLabel}>Votes</span>
          <strong className={styles.highlightValue}>{viewModel.votesLabel}</strong>
        </div>
      </div>
    </>
  );
}
