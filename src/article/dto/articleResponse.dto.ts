import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../../common/enums';

export class articleResponse {
  @ApiProperty({
    description: 'Article id (uuid v4)',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Article title',
    example: 'NestJS',
    type: String,
  })
  title: string;

  @ApiProperty({
    description: 'Article content',
    example: 'NestJS is a framework ...',
    type: String,
  })
  content: string;

  @ApiProperty({
    description: 'Article status',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status?: ArticleStatus;

  @ApiProperty({
    description: 'ID of article author',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    nullable: true,
    type: String,
    format: 'uuid',
  })
  authorId?: string | null;

  @ApiProperty({
    description: 'ID of article category',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    nullable: true,
    type: String,
    format: 'uuid',
  })
  categoryId?: string | null;

  @ApiProperty({
    description: 'Article tags',
    example: '["nestjs", "nodejs", "typescript"]',
    type: [String],
    format: 'uuid',
  })
  tags?: string[];


  @ApiProperty({
      description: 'Timestamp when article was created',
      example: '18753030467823',
  })
  createdAt: number;

  @ApiProperty({
      description: 'Timestamp when article was updated',
      example: '19793030467823',
  })
  updatedAt: number;
}
