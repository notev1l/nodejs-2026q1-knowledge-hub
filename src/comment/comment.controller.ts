import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CommentResponse } from './dto/commentResponse.dto';
import { CreateCommentRequest } from './dto/createCommentRequest.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all comments for specific article',
    description: 'Returns array of all comments for the specified articleId',
  })
  @ApiQuery({ name: 'articleId', type: String, required: true})
  @ApiOkResponse({ description: 'Get all comments', type: CommentResponse})
  getComments(@Query('articleId') articleId: string) {
    return this.commentService.getComments(articleId)
  }
  
  @Post('/')
  @ApiOperation({
    summary: 'Create comment for specific article',
    description: 'Returns created comment for the specified articleId',
  })
  @ApiCreatedResponse({ description: 'Comment created', type: CommentResponse})
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID'})
  @ApiUnprocessableEntityResponse({ description: 'Referenced articleId not found'})
  createComment(@Body() dto : CreateCommentRequest) {
    return this.commentService.createComment(dto)
  }
  
  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete comment for specific article',
  })
  @ApiNoContentResponse({ description: 'Comment deleted', type: CommentResponse})
  @ApiBadRequestResponse({ description: 'Provided Id is not a valid UUID'})
  @ApiNotFoundResponse({ description: 'Comment not found'})
  deleteComment(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.commentService.deleteComment(id)
  }

}
