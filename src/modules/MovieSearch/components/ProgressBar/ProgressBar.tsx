import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  visible: boolean
}

export function ProgressBar({ visible }: ProgressBarProps) {
  if (!visible) {
    return null
  }

  return (
    <div aria-hidden="true" className={styles.track}>
      <div className={styles.fill}></div>
    </div>
  )
}
