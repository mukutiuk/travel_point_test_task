import { LoadingState } from "@/UIKit/LoadingState";
import styles from "./MovieDetailsLoading.module.css";

export function MovieDetailsLoading() {
  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <LoadingState message="Loading movie details..." />
      </div>
    </main>
  );
}
