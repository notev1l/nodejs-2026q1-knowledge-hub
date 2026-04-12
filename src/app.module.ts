import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    ArticleModule,
    CategoryModule,
    CommentModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    PrismaModule,
  ],
})
export class AppModule {}
