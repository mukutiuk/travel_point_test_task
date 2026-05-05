import styles from "./MovieDetailsPoster.module.css";

interface MovieDetailsPosterProps {
  posterUrl: string | null;
  title: string;
}

export function MovieDetailsPoster({
  posterUrl,
  title,
}: MovieDetailsPosterProps) {
  return (
    <div className={styles.column}>
      {posterUrl ? (
        <img
          alt={title}
          className={styles.poster}
          decoding="async"
          src={posterUrl}
        />
      ) : (
        <div className={styles.fallback}>🎬</div>
      )}
    </div>
  );
}
