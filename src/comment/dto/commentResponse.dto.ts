import { ApiProperty } from "@nestjs/swagger";

export class CommentResponse {
    @ApiProperty({
        description: 'Comment id (uuid v4)',
        example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
        type: String,
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        description: 'Comment content',
        example: 'The best article on the Planet!',
        type: String,
    })
    content: string;

    @ApiProperty({
        description: 'articleId where comment was created',
        example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
        type: String,
    })
    articleId: string;

    @ApiProperty({
        description: 'authorId that created comment',
        example: '29d01b2a-f17b-40e0-9c8c-0c05ebbfee36',
        nullable: true,
        type: String,
    })
    authorId?: string | null;
}