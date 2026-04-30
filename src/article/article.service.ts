import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Article, Category, User } from '@prisma/client';
import { ArticleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleRequest } from './dto/createArticleRequest.dto';
import { UpdateArticleRequest } from './dto/updateArticleRequest.dto';
import { GetQueryParams } from './dto/getQueryParams.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArticles(query: GetQueryParams): Promise<Article[]> {
    return await this.prismaService.article.findMany({
      where: {
        ...(query.status !== undefined && { status: query.status }),
        ...(query.categoryId !== undefined && { categoryId: query.categoryId }),
        ...(query.tag !== undefined && { tags: {
          some: {
            name: query.tag
          }
        }})
      },
      include: {
        tags: {
          select: { name: true }
        }
      }
    });
  }

  async getArticle(id: string): Promise<Article> {
    const article = await this.prismaService.article.findUnique({
      where: { id },
      include: {
        tags: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!article) {
      throw new NotFoundException(`Article with id: ${id} was not found`);
    }

    return article;
  }

  async createArticle(dto: CreateArticleRequest): Promise<Article> {

    let author: User
    let category: Category

    if (dto.authorId) {
      author = await this.prismaService.user.findUnique({
        where: { id: dto.authorId },
      })
    }

    if (dto.authorId && !author) {
      throw new NotFoundException(`AuthorId with id: ${dto.authorId} was not found`)
    }
    
    if (dto.categoryId) {
      category = await this.prismaService.category.findUnique({
        where: { id: dto.categoryId }
      })
    }

    if (dto.categoryId && !category) {
      throw new NotFoundException(`CategoryId with id: ${dto.categoryId} was not found`)
    }

    const article = await this.prismaService.article.create({
      data: {
        title: dto.title.trim(),
        content: dto.content.trim(),
        status: dto.status ?? ArticleStatus.DRAFT,
        authorId: dto.authorId ?? null,
        categoryId: dto.categoryId ?? null,
        ...(dto.tags && {
          tags: {
            connectOrCreate: dto.tags.map(tag => ({
              where: { name: tag},
              create: { name: tag},
            })),
          }
        }),
      },
      include: {
        tags: {
          select: {
            name: true,
          }
        }
      }
    });
    
    return article;
  }

  async updateArticle(user: User, id: string, dto: UpdateArticleRequest): Promise<Article> {
    
    const article = await this.getArticle(id)

    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw new ForbiddenException(`You are not allowed to perform this action`)
    }

    return await this.prismaService.article.update({
      where: {
        id,
      },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.content !== undefined && { content: dto.content.trim() }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.authorId !== undefined && { authorId: dto.authorId}),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId}),
        ...(dto.tags !== undefined && { tags: {
          set: [],
          connectOrCreate: dto.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          }))
        }}),
      },
      include: {
        tags: {
          select: {
            name: true,
          }
        }
      }
    });
  }

  async deleteArticle(user: User, id: string): Promise<void> {
    const article = await this.getArticle(id)

    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw new ForbiddenException(`You are not allowed to perform this action`)
    }

    await this.prismaService.article.delete({ where: { id } })
  }
}
