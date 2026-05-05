export function debounce(callback: () => void, delayMs: number) {
  const timeoutId = window.setTimeout(callback, delayMs)

  return () => {
    window.clearTimeout(timeoutId)
  }
}
