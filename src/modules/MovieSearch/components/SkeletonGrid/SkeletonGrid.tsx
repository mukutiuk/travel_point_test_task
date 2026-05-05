import styles from './SkeletonGrid.module.css'

interface SkeletonGridProps {
  count?: number
}

export function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={styles.card} key={`skeleton-${index}`}>
          <div className={styles.poster}></div>
          <div className={styles.info}>
            <div className={`${styles.line} ${styles.title}`}></div>
            <div className={`${styles.line} ${styles.year}`}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={`${styles.line} ${styles.short}`}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
