import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserRequest {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'User login',
    example: 'johndoe',
    type: String,
  })
  login: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'User password',
    example: 'abc123',
    type: String,
  })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be one of: admin, editor, viewer' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role?: UserRole;
}
