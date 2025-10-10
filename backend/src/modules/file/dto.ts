import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  OTHER = 'other',
  AUDIO = 'audio',
  PDF = 'pdf',
}

export class CreateFileRequest {
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsString()
  @IsOptional() // Wait, should be required? In service it's not optional
  fileName: string;

  @IsEnum(FileType)
  type: FileType;

  @IsString()
  extension: string;

  @IsUrl()
  url: string;

  @Type(() => Number)
  @IsNumber()
  size: number;
}

export class GetFilesQuery {
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @IsOptional()
  @IsUUID()
  folderId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number = 0;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'updatedAt' | 'type' | 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class UpdateFileRequest {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsEnum(FileType)
  type?: FileType;

  @IsOptional()
  @IsString()
  extension?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsUUID()
  folderId?: string;
}

export class MoveFileRequest {
  @IsUUID()
  targetFolderId: string;
}
