import { memo } from "react";
import { Button } from '@/UIKit/Button'
import type { PaginationProps } from './Pagination.types'
import styles from './Pagination.module.css'

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

export const Pagination = memo(function Pagination({
  currentPage,
  onPageChange,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav aria-label="Movies pagination" className={styles.pagination}>
      <Button
        className={styles.button}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="soft"
      >
        Previous
      </Button>

      <div className={styles.pages}>
        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const shouldRenderGap = previousPage && page - previousPage > 1;

          return (
            <div className={styles.pageGroup} key={page}>
              {shouldRenderGap ? <span className={styles.gap}>…</span> : null}
              <Button
                aria-current={page === currentPage ? "page" : undefined}
                className={`${styles.button} ${page === currentPage ? styles.pageButtonActive : ""}`}
                onClick={() => onPageChange(page)}
                variant="soft"
              >
                {page}
              </Button>
            </div>
          );
        })}
      </div>

      <Button
        className={styles.button}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant="soft"
      >
        Next
      </Button>
    </nav>
  );
});
