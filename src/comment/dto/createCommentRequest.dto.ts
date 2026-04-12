import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateCommentRequest {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Comment content',
    example: 'The best article on the Planet!',
    type: String,
  })
  content: string;

  @IsString()
  @MinLength(1)
  @IsUUID()
  @ApiProperty({
    description: 'articleId where comment was created',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    type: String,
  })
  articleId: string;

  @IsOptional()
  @ValidateIf((_, authorId) => authorId !== null)
  @IsString()
  @MinLength(1)
  @IsUUID()
  @ApiProperty({
    description: 'authorId that created comment',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    nullable: true,
    type: String,
  })
  authorId?: string | null;
}
