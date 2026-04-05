import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../common/types';
import { CreateCommentRequest } from './dto/createCommentRequest.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CommentService {
    private comments: Comment[] = []
    // check if updateAt updates in users/article
    getComments(articleId: string) {
        return this.comments.filter(comment => comment.articleId === articleId)
    }
    
    createComment(dto: CreateCommentRequest) {
        const newComment = {
            id: randomUUID(),
            content: dto.content,
            articleId: dto.articleId,
            authorId: dto.authorId ?? null,
            createdAt: Date.now()
        }
        this.comments.push(newComment)
    }

    deleteComment(id: string) {
        const commentIndex = this.comments.findIndex(comment => comment.id === id)

        if (commentIndex === -1) throw new NotFoundException(`Comment with id: ${id} was not found`)

        this.comments.splice(commentIndex, 1)
    }
}
