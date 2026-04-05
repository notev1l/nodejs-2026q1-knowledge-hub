import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ArticleStatus } from '../../common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArticleRequest {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Article title',
    example: 'NestJS',
    type: String,
  })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Article content',
    example: 'NestJS is a framework ...',
    type: String,
  })
  content?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  @ApiPropertyOptional({
    description: 'Article status',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status?: ArticleStatus;

  @IsOptional()
  @ValidateIf((_, authorId) => authorId !== null)
  @IsString()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'ID of article author',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    nullable: true,
    type: String,
    format: 'uuid',
  })
  authorId?: string | null;

  @IsOptional()
  @ValidateIf((_, categoryId) => categoryId !== null)
  @IsString()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'ID of article category',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    nullable: true,
    type: String,
    format: 'uuid',
  })
  categoryId?: string | null;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: 'Article tags',
    example: '["nestjs", "nodejs", "typescript"]',
    type: [String],
    format: 'uuid',
  })
  tags?: string[];
}
