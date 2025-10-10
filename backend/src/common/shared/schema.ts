import { IsNumber, IsString, Max, Min } from 'class-validator';

export class PaginationSchema {
  @IsNumber()
  @Min(0)
  page?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsString()
  search?: string;

  @IsString()
  sortBy?: string;

  @IsString()
  sortOrder?: 'asc' | 'desc';
}
