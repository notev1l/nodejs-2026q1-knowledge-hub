import { ArticleStatus } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class GetQueryParams {
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @ValidateIf((_, categoryId) => categoryId !== null)
  @IsString()
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsString()
  tag?: string;
}
