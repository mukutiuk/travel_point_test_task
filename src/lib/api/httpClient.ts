import axios from "axios";
import { APP_ENV } from "@/config";

export const httpClient = axios.create({
  baseURL: APP_ENV.tmdbBaseUrl,
  timeout: APP_ENV.tmdbRequestTimeoutMs,
  headers: APP_ENV.tmdbAccessToken
    ? {
        Authorization: `Bearer ${APP_ENV.tmdbAccessToken}`,
      }
    : undefined,
  params: APP_ENV.tmdbApiKey
    ? {
        api_key: APP_ENV.tmdbApiKey,
      }
    : undefined,
});

httpClient.interceptors.request.use((config) => {
  if (!APP_ENV.tmdbAccessToken && !APP_ENV.tmdbApiKey) {
    throw new Error(
      "TMDB credentials are not configured. Add VITE_TMDB_ACCESS_TOKEN or VITE_TMDB_API_KEY.",
    );
  }

  return config;
});
