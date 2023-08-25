import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { IDataloaders } from './dataloader.interface';
import { UserService } from 'src/module/user/user.service';
import { User } from 'src/module/user/user.entity';
import { Category } from '../category/category.entity';
import { CategoryService } from '../category/category.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly userService: UserService,
    private readonly catService: CategoryService,
  ) {}

  getLoaders(): IDataloaders {
    const usersLoader = this._createUsersLoader();
    const catsLoader = this._createCatsLoader();
    return {
      usersLoader,
      catsLoader,
    };
  }

  private _createUsersLoader() {
    return new DataLoader<string, User>(
      async (keys: readonly string[]) =>
        await this.userService.getUsersByBatch(keys as string[]),
    );
  }

  private _createCatsLoader() {
    return new DataLoader<string, Category>(
      async (keys: readonly string[]) =>
        await this.catService.getCatsByBatch(keys as string[]),
    );
  }
}
