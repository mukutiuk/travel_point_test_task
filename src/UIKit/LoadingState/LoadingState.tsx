import { Loader } from '@/UIKit/Loader'
import styles from './LoadingState.module.css'

interface LoadingStateProps {
  compact?: boolean;
  message: string;
}

export function LoadingState({ compact = false, message }: LoadingStateProps) {
  return (
    <div className={compact ? styles.compact : styles.full}>
      <Loader size={compact ? "sm" : "md"} />
      <p>{message}</p>
    </div>
  );
}
