import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { UserService } from 'src/user/user.service';
import { UserResolver } from 'src/user/user.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [DataloaderService, UserResolver],
  exports: [DataloaderService],
})
export class DataloaderModule {}
