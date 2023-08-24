import { Module } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import { PostCommentResolver } from './post-comment.resolver';

@Module({
  providers: [PostCommentService, PostCommentResolver]
})
export class PostCommentModule {}
