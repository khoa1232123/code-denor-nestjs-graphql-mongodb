import DataLoader from 'dataloader';
import { User } from 'src/module/user/user.entity';
import { Category } from '../category/category.entity';

export interface IDataloaders {
  usersLoader: DataLoader<string, User>;
  catsLoader: DataLoader<string, Category>;
}
