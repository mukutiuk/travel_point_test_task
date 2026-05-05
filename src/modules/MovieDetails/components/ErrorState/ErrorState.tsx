import { Button } from '@/UIKit/Button'
import styles from './ErrorState.module.css'

interface ErrorStateProps {
  compact?: boolean;
  message: string;
  onRetry?: () => void;
  title: string;
}

export function ErrorState({
  compact = false,
  message,
  onRetry,
  title,
}: ErrorStateProps) {
  return (
    <div className={compact ? styles.compact : styles.full}>
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <Button className={styles.retry} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
