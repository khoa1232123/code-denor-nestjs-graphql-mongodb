import { Module } from '@nestjs/common';
import { UserModule } from 'src/module/user/user.module';
import { UserResolver } from 'src/module/user/user.resolver';
import { CategoryModule } from '../category/category.module';
import { DataloaderService } from './dataloader.service';

@Module({
  imports: [UserModule, CategoryModule],
  providers: [DataloaderService, UserResolver],
  exports: [DataloaderService],
})
export class DataloaderModule {}
