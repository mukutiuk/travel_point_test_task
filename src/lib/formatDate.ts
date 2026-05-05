export function formatDate(dateString: string | null | undefined, language = 'en-US') {
  if (!dateString) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}
