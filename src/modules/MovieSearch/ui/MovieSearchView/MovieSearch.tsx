import { type ComponentProps } from "react";
import { Button } from "../../../../UIKit/Button";
import { ErrorBoundary } from "../../../../UIKit/ErrorBoundary";
import { LoadingState } from "../../../../UIKit/LoadingState";
import { AutocompleteDropdown } from "../../components/AutocompleteDropdown";
import { EmptyState } from "../../components/EmptyState";
import { MovieFilters } from "../../components/MovieFilters";
import { MovieList } from "../../components/MovieList";
import { Pagination } from "../../components/Pagination";
import { ProgressBar } from "../../components/ProgressBar";
import { SearchInput } from "../../components/SearchInput";
import { SkeletonGrid } from "../../components/SkeletonGrid";
import styles from "./MovieSearch.module.css";
import { useMovieSearchView } from "../../presenters/useMovieSearchView";

interface SearchResultsContentProps {
  hasMovies: boolean;
  movieListProps: ComponentProps<typeof MovieList>;
  paginationProps: ComponentProps<typeof Pagination>;
  searchError: Error | null;
  showEmptyState: boolean;
  showErrorState: boolean;
  showRefreshingState: boolean;
  showSkeleton: boolean;
}

function SearchResultsContent({
  hasMovies,
  movieListProps,
  paginationProps,
  searchError,
  showEmptyState,
  showErrorState,
  showRefreshingState,
  showSkeleton,
}: SearchResultsContentProps) {
  if (showErrorState) {
    throw searchError ?? new Error("Unable to load movies right now.");
  }

  return (
    <>
      {showRefreshingState ? (
        <LoadingState compact message="Searching for movies..." />
      ) : null}

      {showSkeleton ? <SkeletonGrid /> : null}

      {showEmptyState ? (
        <EmptyState
          description="Try searching with different keywords or check your spelling."
          title="No movies found"
        />
      ) : null}

      {!showSkeleton && hasMovies ? (
        <>
          <MovieList {...movieListProps} />
          <Pagination {...paginationProps} />
        </>
      ) : null}
    </>
  );
}

export function MovieSearch() {
  const {
    autocompleteDropdownProps,
    hasMovies,
    movieFiltersProps,
    movieListProps,
    paginationProps,
    progressVisible,
    resultsCountLabel,
    resultsReference,
    searchError,
    resultsRequestKey,
    retryResults,
    searchContainerReference,
    searchInputProps,
    showEmptyState,
    showErrorState,
    showRefreshingState,
    showResultsSection,
    showSkeleton,
  } = useMovieSearchView();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>TMDB Movie Search</h1>
          <p>Find your favorite movies with powerful search and autocomplete</p>
        </header>

        <section className={styles.searchSection}>
          <div
            className={styles.searchContainer}
            ref={searchContainerReference}
          >
            <SearchInput {...searchInputProps} />
            <AutocompleteDropdown {...autocompleteDropdownProps} />
          </div>

          <MovieFilters {...movieFiltersProps} />
        </section>

        {showResultsSection ? (
          <section className={styles.resultsSection} ref={resultsReference}>
            <ProgressBar visible={progressVisible} />

            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>Search Results</h2>
              <span className={styles.resultsCount}>{resultsCountLabel}</span>
            </div>

            <ErrorBoundary
              fallback={({ error, reset }) => (
                <div className={styles.resultsErrorFallback}>
                  <EmptyState
                    description={error.message}
                    title="Unable to load movies"
                  />
                  <Button
                    onClick={() => {
                      retryResults();
                      reset();
                    }}
                    variant="soft"
                  >
                    Try again
                  </Button>
                </div>
              )}
              resetKeys={[resultsRequestKey]}
            >
              <SearchResultsContent
                hasMovies={hasMovies}
                movieListProps={movieListProps}
                paginationProps={paginationProps}
                searchError={searchError}
                showEmptyState={showEmptyState}
                showErrorState={showErrorState}
                showRefreshingState={showRefreshingState}
                showSkeleton={showSkeleton}
              />
            </ErrorBoundary>
          </section>
        ) : null}
      </div>
    </main>
  );
}
