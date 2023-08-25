import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/module/user/user.module';
import { Post } from './post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, CategoryModule],
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
