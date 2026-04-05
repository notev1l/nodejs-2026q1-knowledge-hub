import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from '../common/types';
import { CreateArticleRequest } from './dto/createArticleRequest.dto';
import { randomUUID } from 'node:crypto';
import { ArticleStatus } from '../common/enums';
import { UpdateArticleRequest } from './dto/updateArticleRequest.dto';
import { GetQueryParams } from './dto/getQueryParams.dto';

@Injectable()
export class ArticleService {
    private articles: Article[] = []

    getArticles(query: GetQueryParams) {
        if (Object.keys(query).length > 0) {
            return this.articles.filter(article => {
                if (query.status && article.status !== query.status) return false
                if (query.categoryId && article.categoryId !== query.categoryId) return false
                if (query.tag && !article.tags.includes(query.tag)) return false
                return true
            })
        }

        return this.articles        
    }

    getArticle(id: string) {
        const article = this.articles.find(article => article.id === id)

        if (!article) throw new NotFoundException(`Article with id: ${id} was not found`) 

        return article
    }

    createArticle(dto: CreateArticleRequest) {
        const newArticle = {
            id: randomUUID(),
            title: dto.title.trim(),
            content: dto.content.trim(),
            status: dto.status ?? ArticleStatus.DRAFT,
            authorId: dto.authorId ?? null,
            categoryId: dto.categoryId ?? null,
            tags: dto.tags ?? [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        this.articles.push(newArticle)

        return newArticle
    }

    updateArticle(id: string, dto: UpdateArticleRequest) {
        const article = this.getArticle(id)

        Object.assign(article, dto)

        return article
    }

    deleteArticle(id: string) {
        const articleIndex = this.articles.findIndex(article => article.id === id)

        if (articleIndex === -1) throw new NotFoundException(`Article with id: ${id} was not found`)

        this.articles.splice(articleIndex, 1)
    }
}
