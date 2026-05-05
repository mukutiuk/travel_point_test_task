import type { SelectOption } from "@/modules/MovieSearch/types/common.types";
import type { MovieSearchFilters } from "@/modules/MovieSearch/types/movieSearch.types";

export interface MovieFiltersProps {
  filters: MovieSearchFilters;
  isOpen: boolean;
  languageOptions: SelectOption[];
  onChange: (nextFilters: Partial<MovieSearchFilters>) => void;
  onToggle: () => void;
  regionOptions: SelectOption[];
}
