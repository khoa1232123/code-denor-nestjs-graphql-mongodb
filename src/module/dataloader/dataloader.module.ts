import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { UserService } from 'src/module/user/user.service';
import { UserResolver } from 'src/module/user/user.resolver';
import { UserModule } from 'src/module/user/user.module';

@Module({
  imports: [UserModule],
  providers: [DataloaderService, UserResolver],
  exports: [DataloaderService],
})
export class DataloaderModule {}
