import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { IDataloaders } from './dataloader.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class DataloaderService {
  constructor(private readonly userService: UserService) {}

  getLoaders(): IDataloaders {
    const friendsLoader = this._createUsersLoader();
    return {
      friendsLoader,
    };
  }

  private _createUsersLoader() {
    return new DataLoader<string, User>(
      async (keys: readonly string[]) =>
        await this.userService.getUsersByBatch(keys as string[]),
    );
  }
}
