/**
 * Generic paginated response shape.
 * Use with any list endpoint that uses PaginationFilterDto.
 */
export interface PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
