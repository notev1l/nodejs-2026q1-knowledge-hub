import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Category name',
    example: 'Guides',
    type: String,
  })
  name: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Category description',
    example: 'Guides are ...',
    type: String,
  })
  description: string;
}
