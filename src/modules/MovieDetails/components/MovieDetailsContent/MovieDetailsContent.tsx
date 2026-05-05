import { Link } from "react-router-dom";
import type { MovieDetails as MovieDetailsEntity } from "@/modules/MovieDetails/entity/dto/movieDetails.entity";
import type { MovieDetailsViewModel } from "@/modules/MovieDetails/presenters/movieDetails.presenter";
import { MovieDetailsActions } from "@/modules/MovieDetails/components/MovieDetailsActions";
import { MovieDetailsInfoGrid } from "@/modules/MovieDetails/components/MovieDetailsInfoGrid";
import { MovieDetailsPoster } from "@/modules/MovieDetails/components/MovieDetailsPoster";
import { MovieDetailsSummary } from "@/modules/MovieDetails/components/MovieDetailsSummary";
import styles from "./MovieDetailsContent.module.css";

interface MovieDetailsContentProps {
  backToSearchUrl: string;
  movie: MovieDetailsEntity;
  viewModel: MovieDetailsViewModel;
}

export function MovieDetailsContent({
  backToSearchUrl,
  movie,
  viewModel,
}: MovieDetailsContentProps) {
  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        style={
          viewModel.backdropUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(15, 16, 40, 0.2), rgba(15, 16, 40, 0.78)), url(${viewModel.backdropUrl})`,
              }
            : undefined
        }
      >
        <div className={styles.heroContent}>
          <Link className={styles.backLink} to={backToSearchUrl}>
            ← Back to search
          </Link>

          <div className={styles.detailsCard}>
            <MovieDetailsPoster
              posterUrl={viewModel.posterUrl}
              title={movie.title}
            />

            <div className={styles.contentColumn}>
              <MovieDetailsSummary movie={movie} viewModel={viewModel} />

              {movie.genres.length ? (
                <div className={styles.genreRow}>
                  {movie.genres.map((genre) => (
                    <span className={styles.genre} key={genre.id}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Overview</h2>
                <p className={styles.sectionText}>
                  {movie.overview ||
                    "No overview has been published for this film yet."}
                </p>
              </div>

              <MovieDetailsInfoGrid viewModel={viewModel} />
              <MovieDetailsActions movie={movie} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
