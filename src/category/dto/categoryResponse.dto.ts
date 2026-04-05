import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty({
    description: 'Category id (uuid v4)',
    example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Guides',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Guides are ...',
    type: String,
  })
  description: string;
}
