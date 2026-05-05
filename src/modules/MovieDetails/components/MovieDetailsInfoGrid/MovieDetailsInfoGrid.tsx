import type { MovieDetailsViewModel } from "@/modules/MovieDetails/presenters/movieDetails.presenter";
import styles from "./MovieDetailsInfoGrid.module.css";

interface MovieDetailsInfoGridProps {
  viewModel: MovieDetailsViewModel;
}

export function MovieDetailsInfoGrid({
  viewModel,
}: MovieDetailsInfoGridProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.label}>Budget</span>
        <strong className={styles.value}>{viewModel.budgetLabel}</strong>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Revenue</span>
        <strong className={styles.value}>{viewModel.revenueLabel}</strong>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Languages</span>
        <strong className={styles.value}>{viewModel.languagesLabel}</strong>
      </div>
      <div className={styles.card}>
        <span className={styles.label}>Countries</span>
        <strong className={styles.value}>{viewModel.countriesLabel}</strong>
      </div>
    </div>
  );
}
