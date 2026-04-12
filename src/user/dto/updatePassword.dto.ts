import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'User current password',
    example: 'abc123',
    type: 'string',
  })
  oldPassword: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'User new password',
    example: '321cba',
    type: 'string',
  })
  newPassword: string;
}
