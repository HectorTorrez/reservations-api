import { Injectable } from '@nestjs/common';
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

/** Config for paginateFromFilter: delegate, buildWhere from filter, optional map. */
export interface PaginationConfig<
  T,
  R = T,
  F extends PaginationParams = PaginationParams,
> {
  delegate: PaginationDelegate<T>;
  buildWhere: (filter: F) => unknown;
  map?: (items: T[]) => R[];
}

@Injectable()
export class PaginationService {
  /**
   * Paginate using a filter that includes where-building: buildWhere(filter) runs inside the service.
   * Use this when the filter (e.g. PropertyFilterDto) carries both pagination and domain filters.
   */
  async paginateFromFilter<
    T,
    R = T,
    F extends PaginationParams = PaginationParams,
  >(
    filter: F,
    config: PaginationConfig<T, R, F>,
  ): Promise<PaginatedResponseDto<R> | R[]> {
    const where = config.buildWhere(filter);
    return this.paginate(filter, config.delegate, where, config.map);
  }

  /**
   * When filter.paginated is true, returns { data, total, page, pageSize, totalPages }.
   * When filter.paginated is false, returns a plain array.
   */
  async paginate<T, R = T, W = unknown>(
    filter: PaginationParams,
    delegate: PaginationDelegate<T>,
    where: W,
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
}
