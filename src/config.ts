const DEFAULT_TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const DEFAULT_TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const APP_ENV = {
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN,
  tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY,
  tmdbBaseUrl: import.meta.env.VITE_TMDB_BASE_URL ?? DEFAULT_TMDB_BASE_URL,
  tmdbImageBaseUrl: DEFAULT_TMDB_IMAGE_BASE_URL,
  tmdbRequestTimeoutMs: 15000,
} as const
