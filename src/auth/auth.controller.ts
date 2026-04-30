import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserResponse } from '../user/dto/userResponse.dto';
import { AuthDTO } from './dto/auth.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Public()
  @Post('/signup')
  @ApiOperation({
    summary: 'SignUp',
    description: 'Returns created user',
  })
  @ApiCreatedResponse({ description: 'User created', type: UserResponse })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields or they are not strings, or login is already taken'
  })
  signUp(@Body() dto: AuthDTO) {
    return this.authService.signUp(dto.login, dto.password);
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Public()
  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description: 'Returns access and refresh tokens',
  })
  @HttpCode(200)
  @ApiOkResponse({ description: 'Access and refresh tokens' })
  @ApiBadRequestResponse({
    description: 'No login or password, or they are not strings.',
  })
  @ApiForbiddenResponse({ description: `No user with such login or password doesnt match the actual one` })
  logIn(@Body() dto: AuthDTO) {
    return this.authService.logIn(dto.login, dto.password);
  }

  @Public()
  @Post('/refresh')
  @ApiOperation({
    summary: 'Refresh',
    description: 'Returns access and refresh tokens',
  })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @HttpCode(200)  
  @ApiOkResponse({ description: 'Access and refresh tokens' })
  @ApiUnauthorizedResponse({
    description: 'No refresh token in body',
  })
  @ApiForbiddenResponse({ description: 'Refresh token is invalid or expired' })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout and invalidate refresh token from DB',
  })
  @HttpCode(200)  
  @ApiOkResponse({ description: 'Logout successful' })
  @ApiUnauthorizedResponse({
    description: 'You are not logged in',
  })
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
