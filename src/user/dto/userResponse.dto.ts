import { UserRole } from '../../common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponse {
  @ApiProperty({
      description: 'User id (uuid v4)',
      example: '5ac7b81c-e291-403f-acbe-d0d2d2fd8583',
      type: 'string',
  })
  id: string;

  @ApiProperty({
      description: 'User login',
      example: 'johndoe',
      type: 'string',
  })
  login: string;

  @Exclude()
  password: string

  @ApiPropertyOptional({
      description: 'User role',
      enum: UserRole,
      default: UserRole.VIEWER,
  })
  role?: UserRole;

  @ApiPropertyOptional({
      description: 'Timestamp when user was created',
      example: '18753030467823',
  })
  createdAt: number;

  @ApiPropertyOptional({
      description: 'Timestamp when user was updated',
      example: '19793030467823',
  })
  updatedAt: number;

  constructor(partialResponse: Partial<UserResponse>) {
    Object.assign(this, partialResponse);
  }
}