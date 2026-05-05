import { Link } from "react-router-dom";
import { ErrorState } from "@/modules/MovieDetails/components/ErrorState";
import styles from "./MovieDetailsError.module.css";

interface MovieDetailsErrorProps {
  backToSearchUrl: string;
  message: string;
  onRetry: () => void;
}

export function MovieDetailsError({
  backToSearchUrl,
  message,
  onRetry,
}: MovieDetailsErrorProps) {
  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <Link className={styles.backLink} to={backToSearchUrl}>
          ← Back to search
        </Link>
        <ErrorState
          message={message}
          onRetry={onRetry}
          title="Movie details unavailable"
        />
      </div>
    </main>
  );
}
