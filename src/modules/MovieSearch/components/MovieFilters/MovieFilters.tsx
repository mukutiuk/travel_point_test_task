import { Button } from "@/UIKit/Button";
import { Checkbox } from "@/UIKit/Checkbox";
import { Input } from "@/UIKit/Input";
import { Select } from "@/UIKit/Select";
import type { MovieFiltersProps } from "./MovieFilters.types";
import { useMovieFilters } from "../../presenters/useMovieFilters";
import styles from "./MovieFilters.module.css";

export function MovieFilters({
  filters,
  isOpen,
  languageOptions,
  onChange,
  onToggle,
  regionOptions,
}: MovieFiltersProps) {
  const {
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
  } = useMovieFilters({
    filters,
    onChange,
  });

  return (
    <div className={styles.filters}>
      <Button className={styles.toggle} onClick={onToggle} variant="text">
        {isOpen ? "🔼 Hide Advanced Options" : "🔽 Advanced Search Options"}
      </Button>

      <div
        className={`${styles.content} ${isOpen ? styles.contentVisible : ""}`}
      >
        <label className={styles.field}>
          <span className={styles.label}>Language</span>
          <Select
            onChange={handleLanguageChange}
            options={languageOptions}
            value={filters.language}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Release Year</span>
          <Input
            max="2030"
            min="1900"
            onChange={handlePrimaryReleaseYearChange}
            placeholder="e.g. 2024"
            type="number"
            value={primaryReleaseYearDraft}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Year</span>
          <Input
            max="2030"
            min="1900"
            onChange={handleYearChange}
            placeholder="e.g. 2024"
            type="number"
            value={yearDraft}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Region</span>
          <Select
            onChange={handleRegionChange}
            options={regionOptions}
            value={filters.region}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Page</span>
          <Input
            max="1000"
            min="1"
            onBlur={handlePageBlur}
            onChange={handlePageChange}
            onKeyDown={handlePageKeyDown}
            placeholder="1"
            type="number"
            value={pageDraft}
          />
        </label>

        <div className={styles.field}>
          <span className={styles.label}>Content Filter</span>
          <Checkbox
            checked={filters.includeAdult}
            label="Include Adult Content"
            onChange={handleIncludeAdultChange}
          />
        </div>
      </div>
    </div>
  );
}
