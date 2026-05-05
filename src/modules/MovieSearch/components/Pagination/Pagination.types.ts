export interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}
