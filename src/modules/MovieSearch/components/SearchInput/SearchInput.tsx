import type { KeyboardEvent } from "react";
import { Input } from "@/UIKit/Input";
import type { SearchInputProps } from "./SearchInput.types";
import styles from "./SearchInput.module.css";

export function SearchInput({
  onChange,
  onFocus,
  onHideSuggestions,
  onSubmit,
  placeholder = "Search for movies...",
  value,
}: SearchInputProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSubmit();
      event.currentTarget.blur();

      return;
    }

    if (event.key === "Escape") {
      onHideSuggestions();
    }
  }

  return (
    <div className={styles.wrapper}>
      <Input
        aria-label="Search for movies"
        autoComplete="off"
        className={styles.input}
        inputMode="search"
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
