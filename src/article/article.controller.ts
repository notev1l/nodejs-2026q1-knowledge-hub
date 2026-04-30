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
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateArticleRequest } from './dto/createArticleRequest.dto';
import { UpdateArticleRequest } from './dto/updateArticleRequest.dto';
import { ArticleResponse } from './dto/articleResponse.dto';
import { GetQueryParams } from './dto/getQueryParams.dto';
import { ArticleStatus, User, UserRole } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all articles',
    description: 'Returns array of all articles',
  })
  @ApiQuery({ name: 'status', enum: ArticleStatus, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  @ApiQuery({ name: 'tag', type: String, required: false })
  @ApiOkResponse({ description: 'Get all articles', type: [ArticleResponse] })
  getArticles(@Query() query: GetQueryParams) {
    return this.articleService.getArticles(query);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get article by Id',
    description: 'Returns specific article by Id',
  })
  @ApiOkResponse({ description: 'Article found', type: ArticleResponse })
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  getArticleById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.articleService.getArticle(id);
  }

  @Roles(UserRole.EDITOR)
  @Post('/')
  @ApiOperation({
    summary: 'Create article',
    description: 'Returns created article',
  })
  @ApiCreatedResponse({ description: 'Article created', type: ArticleResponse })
  @ApiBadRequestResponse({
    description: 'Request body does not contain required fields',
  })
  createArticle(@Body() dto: CreateArticleRequest) {
    return this.articleService.createArticle(dto);
  }

  @Roles(UserRole.EDITOR)
  @Put('/:id')
  @ApiOperation({
    summary: 'Update article',
    description: 'Returns updated article',
  })
  @ApiOkResponse({ description: 'Article updated', type: ArticleResponse })
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  @ApiForbiddenResponse({ description: '123' })
  updateArticle(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateArticleRequest,
  ) {
    return this.articleService.updateArticle(user, id, dto);
  }

  @Roles(UserRole.EDITOR)
  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete article',
  })
  @ApiNoContentResponse({
    description: 'Article deleted',
    type: ArticleResponse,
  })
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'Article not found' })
  deleteArticle(@CurrentUser() user: User, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.articleService.deleteArticle(user, id);
  }
}
