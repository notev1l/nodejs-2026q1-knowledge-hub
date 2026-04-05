import { Controller, Get, Post, Put, Param, Body, ParseUUIDPipe, Delete, UseInterceptors, ClassSerializerInterceptor, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/createUserRequest.dto';
import { UpdatePasswordDto } from './dto/UpdatePassword.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UserResponse } from './dto/userResponse.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns array of all users'
  })
  @ApiOkResponse({ description: 'Array of user records', type: [UserResponse] })
  getUsers() {
    return this.userService.getUsers().map(user => new UserResponse(user))
  }
  
  @Get('/:id')
  @ApiOperation({
    summary: 'Get specific user by ID',
    description: 'Returns specific user'
  })
  @ApiParam({ name: 'id', description: 'User ID'})
  @ApiOkResponse({ description: 'User found', type: UserResponse })
  @ApiBadRequestResponse({ description: 'Provided ID is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'User not found' }) 
  getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return new UserResponse(this.userService.getUserById(id))
  }
  
  @Post('/')
  @ApiOperation({
    summary: 'Create user',
    description: 'Returns created user'
  })
  @ApiCreatedResponse({ description: 'User created', type: UserResponse })
  @ApiBadRequestResponse({ description: 'Request body does not contain required fields' })
  createUser(@Body() dto: CreateUserRequest) {
    return new UserResponse(this.userService.createUser(dto))
  }
  
  @Put('/:id')
  @ApiOperation({
    summary: 'Update user password',
    description: 'Returns updated user'
  })
  @ApiParam({ name: 'id', description: 'User ID'})
  @ApiOkResponse({ description: 'User updated', type: UserResponse  })
  @ApiBadRequestResponse({ description: 'Invalid user ID' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Wrong password' })
  updatePassword(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdatePasswordDto) {
    return new UserResponse(this.userService.updatePassword(id, dto))
  }
  
  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete user',
  })
  @HttpCode(204)
  @ApiParam({ name: 'id', description: 'User ID'})
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiBadRequestResponse({ description: 'Invalid user ID' })
  @ApiNotFoundResponse({ description: 'User not found' })
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.deleteUser(id)
  }
}