import styles from './EmptyState.module.css'

interface EmptyStateProps {
  description: string
  title: string
}

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
