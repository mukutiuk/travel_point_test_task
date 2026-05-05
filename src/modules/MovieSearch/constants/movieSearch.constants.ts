import type { MovieSearchFilters } from "@/modules/MovieSearch/types/movieSearch.types";
import type { SelectOption } from "@/modules/MovieSearch/types/common.types";

export const MOVIE_SEARCH_MIN_QUERY_LENGTH = 1;
export const MOVIE_SEARCH_DEBOUNCE_MS = 750;

export const DEFAULT_MOVIE_SEARCH_FILTERS: MovieSearchFilters = {
  includeAdult: false,
  language: "en-US",
  page: 1,
  primaryReleaseYear: "",
  region: "",
  year: "",
};

export const MOVIE_SEARCH_LANGUAGE_OPTIONS: SelectOption[] = [
  { label: "English (US)", value: "en-US" },
  { label: "English (UK)", value: "en-GB" },
  { label: "Spanish", value: "es-ES" },
  { label: "French", value: "fr-FR" },
  { label: "German", value: "de-DE" },
  { label: "Italian", value: "it-IT" },
  { label: "Japanese", value: "ja-JP" },
  { label: "Korean", value: "ko-KR" },
  { label: "Chinese", value: "zh-CN" },
];

export const MOVIE_SEARCH_REGION_OPTIONS: SelectOption[] = [
  { label: "All regions", value: "" },
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "Canada", value: "CA" },
  { label: "Australia", value: "AU" },
  { label: "Germany", value: "DE" },
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES" },
  { label: "Italy", value: "IT" },
  { label: "Japan", value: "JP" },
  { label: "South Korea", value: "KR" },
];
