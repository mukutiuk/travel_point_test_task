import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { MovieCardProps } from './MovieCard.types'
import styles from './MovieCard.module.css'

export const MovieCard = memo(function MovieCard({
  genres,
  href,
  overview,
  posterUrl,
  rating,
  title,
  year,
}: MovieCardProps) {
  return (
    <Link
      aria-label={`Open details for ${title}`}
      className={styles.card}
      to={href}
    >
      <div className={styles.posterWrap}>
        {posterUrl ? (
          <img
            alt={title}
            className={styles.poster}
            decoding="async"
            loading="lazy"
            src={posterUrl}
          />
        ) : (
          <div className={styles.posterFallback}></div>
        )}
        <span className={styles.rating}>{rating}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.year}>{year}</p>
        <p className={styles.overview}>{overview}</p>

        {genres.length ? (
          <div className={styles.genres}>
            {genres.map((genre) => (
              <span className={styles.genre} key={genre}>
                {genre}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
})
