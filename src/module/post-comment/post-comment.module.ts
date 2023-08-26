import { Module } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { PostCommentResolver } from './post-comment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from './post-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment])],
  providers: [PostCommentService, PostCommentResolver],
  exports: [PostCommentService],
})
export class PostCommentModule {}
