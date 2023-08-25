import { Module } from '@nestjs/common';
import { UserModule } from 'src/module/user/user.module';
import { UserResolver } from 'src/module/user/user.resolver';
import { CategoryModule } from '../category/category.module';
import { DataloaderService } from './dataloader.service';
import { PostModule } from '../post/post.module';
import { PostResolver } from '../post/post.resolver';

@Module({
  imports: [UserModule, CategoryModule, PostModule],
  providers: [DataloaderService, UserResolver, PostResolver],
  exports: [DataloaderService],
})
export class DataloaderModule {}
