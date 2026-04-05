import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateArticleRequest } from './dto/createArticleRequest.dto';
import { articleResponse } from './dto/articleResponse.dto';
import { UpdateArticleRequest } from './dto/updateArticleRequest.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}


  // Supports optional query parameters for filtering: status, categoryId, tag (e.g. GET /article?status=published&tag=nodejs)
  @Get('/')
  @ApiOperation({
    summary: 'Get all articles',
    description: 'Returns array of all articles',
  })
  @ApiOkResponse({ description: 'Get all articles', type: [articleResponse] })
  getArticles() {
    return this.articleService.getArticles()
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get article by Id',
    description: 'Returns specific article by Id'
  })
  @ApiOkResponse({ description: 'Article found', type: articleResponse})
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID'})
  @ApiNotFoundResponse({ description: 'Article not found'})
  getArticle(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.articleService.getArticle(id)
  }

  @Post('/')
  @ApiOperation({
    summary: 'Create article',
    description: 'Returns created article'
  })
  @ApiCreatedResponse({ description: 'Article created', type: articleResponse})
  @ApiBadRequestResponse({ description: 'Request body does not contain required fields'})
  createArticle(@Body() dto: CreateArticleRequest) {
    return this.articleService.createArticle(dto)
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update article',
    description: 'Returns updated article'
  })
  @ApiOkResponse({ description: 'Article updated', type: articleResponse})
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID'})
  @ApiNotFoundResponse({ description: 'Article not found'})
  updateArticle(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateArticleRequest) {
    return this.articleService.updateArticle(id, dto)
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete article',
  })
  @ApiNoContentResponse({ description: 'Article deleted', type: articleResponse})
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID'})
  @ApiNotFoundResponse({ description: 'Article not found'})
  deleteArticle(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.articleService.deleteArticle(id)
  }
}
