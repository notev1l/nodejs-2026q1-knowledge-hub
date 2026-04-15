import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from '@prisma/client';
import { ArticleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleRequest } from './dto/createArticleRequest.dto';
import { UpdateArticleRequest } from './dto/updateArticleRequest.dto';
import { GetQueryParams } from './dto/getQueryParams.dto';
import { randomUUID } from 'node:crypto';
import { title } from 'node:process';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArticles(query: GetQueryParams) {
    return this.prismaService.article.findMany({
      where: {
        ...(query.status !== undefined && { status: query.status }),
        ...(query.categoryId !== undefined && { categoryId: query.categoryId }),
        ...(query.tag !== undefined && { tags: {
          some: {
            name: query.tag
          }
        }})
      },
    });
  }

  async getArticle(id: string): Promise<Article> {
    const article = this.prismaService.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with id: ${id} was not found`);
    }

    return article;
  }

  async createArticle(dto: CreateArticleRequest) {
    const article = this.prismaService.article.create({
      data: {
        title: dto.title.trim(),
        content: dto.content.trim(),
        status: dto.status ?? ArticleStatus.DRAFT,
        authorId: dto.authorId ?? null,
        categoryId: dto.categoryId ?? null,
        tags: dto.tags ? {
          connectOrCreate: dto.tags.map(tag => ({
            where: { name: tag},
            create: { name: tag},
          })),
        } : null,
      },
    });

    return article;
  }

  async updateArticle(id: string, dto: UpdateArticleRequest) {
    return await this.prismaService.article.update({
      where: {
        id,
      },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.content !== undefined && { content: dto.content.trim() }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.authorId !== undefined && { authorId: dto.authorId ?? null }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId ?? null }),
        ...(dto.tags !== undefined && { tags: {
          connectOrCreate: dto.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          }))
        }}),
      },
    });
  }

/*   setPropertyIdToNull(id: string, propertyName: 'authorId' | 'categoryId') {
    this.articles
      .filter((article) => article[propertyName] === id)
      .forEach((article) => (article[propertyName] = null));
  } */

  async deleteArticle(id: string) {
    await this.prismaService.article.delete({
      where: { id }
    })

/*     if (articleIndex === -1)
      throw new NotFoundException(`Article with id: ${id} was not found`); */
  }

/*   async checkIfArticleIdExists(articleId: string) {
    const isExists = Boolean(
      this.articles.find((article) => article.id === articleId),
    );
    return isExists;
  } */
}
