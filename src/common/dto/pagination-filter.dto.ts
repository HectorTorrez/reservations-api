import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Reusable pagination query params.
 * Extend this class in your filter DTOs when you need pagination.
 */
export class PaginationFilterDto {
  @IsOptional()
  @Transform(({ value }) =>
    value === false || value === 'false' ? false : true,
  )
  @IsBoolean()
  paginated?: boolean = true;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit must not exceed 100' })
  pageSize?: number = 10;
}
