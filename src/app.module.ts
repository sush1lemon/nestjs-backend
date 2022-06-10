import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { SubredditModule } from './subreddit/subreddit.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    SubredditModule,
    CommentModule,
  ],
})
export class AppModule {}
