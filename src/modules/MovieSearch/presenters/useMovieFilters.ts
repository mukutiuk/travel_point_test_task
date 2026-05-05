import {
  useEffect,
  useEffectEvent,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { MOVIE_SEARCH_DEBOUNCE_MS } from "@/modules/MovieSearch/constants/movieSearch.constants";
import { debounce } from "@/lib/debounce";
import type { MovieFiltersProps } from "../components/MovieFilters/MovieFilters.types";

const MIN_PAGE = 1;
const MAX_PAGE = 1000;

function normalizePageValue(value: string) {
  const parsedPage = Number(value);

  if (!Number.isFinite(parsedPage)) {
    return MIN_PAGE;
  }

  return Math.min(MAX_PAGE, Math.max(MIN_PAGE, Math.trunc(parsedPage)));
}

export function useMovieFilters({
  filters,
  onChange,
}: Pick<MovieFiltersProps, "filters" | "onChange">) {
  const [primaryReleaseYearDraft, setPrimaryReleaseYearDraft] = useState(
    filters.primaryReleaseYear,
  );
  const [yearDraft, setYearDraft] = useState(filters.year);
  const [pageDraft, setPageDraft] = useState(String(filters.page));

  const commitPrimaryReleaseYear = useEffectEvent((nextValue: string) => {
    onChange({ primaryReleaseYear: nextValue });
  });
  const commitYear = useEffectEvent((nextValue: string) => {
    onChange({ year: nextValue });
  });

  useEffect(() => {
    setPrimaryReleaseYearDraft(filters.primaryReleaseYear);
  }, [filters.primaryReleaseYear]);

  useEffect(() => {
    setYearDraft(filters.year);
  }, [filters.year]);

  useEffect(() => {
    setPageDraft(String(filters.page));
  }, [filters.page]);

  useEffect(() => {
    if (primaryReleaseYearDraft === filters.primaryReleaseYear) {
      return;
    }

    return debounce(() => {
      commitPrimaryReleaseYear(primaryReleaseYearDraft);
    }, MOVIE_SEARCH_DEBOUNCE_MS);
  }, [filters.primaryReleaseYear, primaryReleaseYearDraft]);

  useEffect(() => {
    if (yearDraft === filters.year) {
      return;
    }

    return debounce(() => {
      commitYear(yearDraft);
    }, MOVIE_SEARCH_DEBOUNCE_MS);
  }, [filters.year, yearDraft]);

  function commitPage(nextValue: string) {
    const normalizedPage = normalizePageValue(nextValue);

    setPageDraft(String(normalizedPage));

    if (normalizedPage !== filters.page) {
      onChange({ page: normalizedPage });
    }
  }

  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange({ language: event.target.value });
  }

  function handlePrimaryReleaseYearChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setPrimaryReleaseYearDraft(event.target.value);
  }

  function handleYearChange(event: ChangeEvent<HTMLInputElement>) {
    setYearDraft(event.target.value);
  }

  function handleRegionChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange({ region: event.target.value });
  }

  function handlePageChange(event: ChangeEvent<HTMLInputElement>) {
    setPageDraft(event.target.value);
  }

  function handlePageBlur() {
    commitPage(pageDraft);
  }

  function handlePageKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    commitPage(pageDraft);
    event.currentTarget.blur();
  }

  function handleIncludeAdultChange(checked: boolean) {
    onChange({ includeAdult: checked });
  }

  return {
    handleIncludeAdultChange,
    handleLanguageChange,
    handlePageBlur,
    handlePageChange,
    handlePageKeyDown,
    handlePrimaryReleaseYearChange,
    handleRegionChange,
    handleYearChange,
    pageDraft,
    primaryReleaseYearDraft,
    yearDraft,
  };
}
