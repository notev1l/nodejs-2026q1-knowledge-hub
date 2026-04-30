import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CategoryResponse } from './dto/categoryResponse.dto';
import { CreateCategoryRequest } from './dto/createCategoryRequest.dto';

@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Returns array of all categories',
  })
  @ApiOkResponse({
    description: 'Array of category records',
    type: [CategoryResponse],
  })
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get specific category by ID',
    description: 'Returns specific category',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({ description: 'Category found', type: CategoryResponse })
  @ApiBadRequestResponse({ description: 'Provided ID is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  getCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.getCategory(id);
  }

  @Post('/')
  @ApiOperation({
    summary: 'Create category',
    description: 'Returns created category',
  })
  @ApiCreatedResponse({
    description: 'Category created',
    type: CategoryResponse,
  })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  createCategory(@Body() dto: CreateCategoryRequest) {
    return this.categoryService.createCategory(dto);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update category password',
    description: 'Returns updated category',
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({ description: 'Category updated', type: CategoryResponse })
  @ApiBadRequestResponse({ description: 'Invalid category ID' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateCategoryRequest,
  ) {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete category',
  })
  @HttpCode(204)
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiNoContentResponse({ description: 'Category deleted' })
  @ApiBadRequestResponse({ description: 'Invalid category ID' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
