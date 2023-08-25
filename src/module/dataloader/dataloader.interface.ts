import DataLoader from 'dataloader';
import { User } from 'src/module/user/user.entity';
import { Category } from '../category/category.entity';
import { Post } from '../post/post.entity';

export interface IDataloaders {
  usersLoader: DataLoader<string, User>;
  postsWithUserLoader: DataLoader<string, Post[]>;
  catsLoader: DataLoader<string, Category>;
}
