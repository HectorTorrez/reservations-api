import { PaginatedResponseDto } from '../dto/paginated-response.dto';

/** Minimal pagination params (e.g. from PaginationFilterDto). */
export interface PaginationParams {
  paginated?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Delegate shape (e.g. Prisma model): has findMany and count.
 * Use type assertion when passing a Prisma delegate: as PaginationDelegate<YourModel>.
 */
export interface PaginationDelegate<T> {
  findMany: (args: {
    where?: unknown;
    skip?: number;
    take?: number;
  }) => Promise<T[]>;
  count: (args: { where?: unknown }) => Promise<number>;
}

/**
 * Reusable pagination helper. Count and map are handled inside the util.
 * When filter.paginated is true, returns { data, total, page, pageSize, totalPages }.
 * When filter.paginated is false, returns a plain array.
 *
 * @example
 * return paginate(query, this.prisma.property, where, (items) => PropertyMapper.toResponseList(items));
 */
export async function paginate<T, R = T>(
  filter: PaginationParams,
  delegate: PaginationDelegate<T>,
  where: unknown,
  map?: (items: T[]) => R[],
): Promise<PaginatedResponseDto<R> | R[]> {
  const isPaginated = filter.paginated !== false;

  if (!isPaginated) {
    const data = await delegate.findMany({ where });
    return map ? map(data) : (data as unknown as R[]);
  }

  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    delegate.findMany({ where, skip, take: pageSize }),
    delegate.count({ where }),
  ]);

  const mappedData = map ? map(data) : (data as unknown as R[]);

  return {
    data: mappedData,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
