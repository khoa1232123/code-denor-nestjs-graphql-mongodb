import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { IDataloaders } from './dataloader.interface';
import { UserService } from 'src/module/user/user.service';
import { User } from 'src/module/user/user.entity';

@Injectable()
export class DataloaderService {
  constructor(private readonly userService: UserService) {}

  getLoaders(): IDataloaders {
    const usersLoader = this._createUsersLoader();
    return {
      usersLoader,
    };
  }

  private _createUsersLoader() {
    return new DataLoader<string, User[]>(
      async (keys: readonly string[]) =>
        await this.userService.getUsersByBatch(keys as string[]),
    );
  }
}
