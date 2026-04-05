import { forwardRef, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Comment } from '../common/types';
import { CreateCommentRequest } from './dto/createCommentRequest.dto';
import { randomUUID } from 'node:crypto';
import { ArticleService } from '../article/article.service';

@Injectable()
export class CommentService {
    private comments: Comment[] = []
    
    constructor(
        @Inject(forwardRef(() => ArticleService))
        private readonly articleService: ArticleService,
    ) {}

    getCommentsByArticleId(articleId: string) {
        return this.comments.filter(comment => comment.articleId === articleId)
    }
    
    getCommentsById(id: string) {
        const comment = this.comments.find(comment => comment.id === id)

        if (!comment) throw new NotFoundException(`Comment with id: ${id} was not found`)
        
        return comment
    }
    
    createComment(dto: CreateCommentRequest) {
        if (!this.articleService.checkIfArticleIdExists(dto.articleId)) throw new UnprocessableEntityException(`ArticleId ${dto.articleId} doesnt exists`)

        const newComment = {
            id: randomUUID(),
            content: dto.content,
            articleId: dto.articleId,
            authorId: dto.authorId ?? null,
            createdAt: Date.now()
        }
        this.comments.push(newComment)

        return newComment
    }

    deleteCommentById(id: string) {
        const commentIndex = this.comments.findIndex(comment => comment.id === id)

        if (commentIndex === -1) throw new NotFoundException(`Comment with id: ${id} was not found`)

        this.comments.splice(commentIndex, 1)
    }

    deleteCommentsByPropertyId(id: string, propertyName: 'authorId' | 'articleId') {
        this.comments = this.comments.filter(comment => comment[propertyName] !== id)
    }
}
