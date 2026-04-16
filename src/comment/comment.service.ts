import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CreateCommentRequest } from './dto/createCommentRequest.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {

  constructor(private readonly prismaService: PrismaService) {}

  async getCommentsByArticleId(articleId: string): Promise<Comment[]> {
    return await this.prismaService.comment.findMany({
      where: { articleId }
    })
  }

  async getCommentById(id: string): Promise<Comment> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id }
    })

    if (!comment)
      throw new NotFoundException(`Comment with id: ${id} was not found`);

    return comment;
  }

  async createComment(dto: CreateCommentRequest): Promise<Comment> {
    const articleId = await this.prismaService.article.findUnique({
      where: { id: dto.articleId}
    })
    if (dto.articleId && !articleId) {
      throw new UnprocessableEntityException(
        `ArticleId ${dto.articleId} doesnt exists`,
      );
    }
    
     const authorId = await this.prismaService.user.findUnique({
      where: { id: dto.authorId}
    })
    if (dto.authorId && !authorId) {
      throw new UnprocessableEntityException(
        `AuthorId ${dto.authorId} doesnt exists`,
      );
    }

    const newComment = await this.prismaService.comment.create({
      data: {
        content: dto.content,
        articleId: dto.articleId,
        authorId: dto.authorId ?? null,
      }
    })

    return newComment
  }

  async deleteCommentById(id: string): Promise<void> {
    const comment = await this.getCommentById(id)

    if (!comment)
      throw new NotFoundException(`Comment with id: ${id} was not found`);

    await this.prismaService.comment.delete({
      where: { id }
    })
  }
}
