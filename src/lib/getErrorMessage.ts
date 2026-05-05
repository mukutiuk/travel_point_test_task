import axios from 'axios'

interface TmdbErrorShape {
  status_message?: string
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<TmdbErrorShape>(error)) {
    if (!error.response) {
      return navigator.onLine === false
        ? 'No internet connection. Check your connection and try again.'
        : 'Network error. Please try again in a moment.'
    }

    return error.response?.data?.status_message ?? error.message ?? fallbackMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
