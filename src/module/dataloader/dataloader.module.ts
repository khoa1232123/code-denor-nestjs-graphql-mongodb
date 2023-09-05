import { Module } from '@nestjs/common';
import { UserModule } from 'src/module/user/user.module';
import { UserResolver } from 'src/module/user/user.resolver';
import { CategoryModule } from '../category/category.module';
import { CategoryResolver } from '../category/category.resolver';
import { PostModule } from '../post/post.module';
import { PostResolver } from '../post/post.resolver';
import { TagModule } from '../tag/tag.module';
import { TagResolver } from '../tag/tag.resolver';
import { DataloaderService } from './dataloader.service';
import { PostCommentModule } from '../post-comment/post-comment.module';
import { PostCommentResolver } from '../post-comment/post-comment.resolver';
import { AttributeModule } from '../attribute/attribute.module';
import { AttributeResolver } from '../attribute/attribute.resolver';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    PostModule,
    TagModule,
    PostCommentModule,
    AttributeModule,
  ],
  providers: [
    DataloaderService,
    UserResolver,
    PostResolver,
    CategoryResolver,
    TagResolver,
    PostCommentResolver,
    AttributeResolver,
  ],
  exports: [DataloaderService],
})
export class DataloaderModule {}
