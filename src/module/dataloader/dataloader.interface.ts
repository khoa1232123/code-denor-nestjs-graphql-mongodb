import DataLoader from 'dataloader';
import { User } from 'src/module/user/user.entity';
import { Category } from '../category/category.entity';
import { Post } from '../post/post.entity';
import { Tag } from '../tag/tag.entity';
import { PostComment } from '../post-comment/post-comment.entity';

export interface IDataloaders {
  usersLoader: DataLoader<string, User>;
  postsWithUserLoader: DataLoader<string, Post[]>;
  postsWithCatLoader: DataLoader<string, Post[]>;
  postsWithTagLoader: DataLoader<string, Post[]>;
  catsLoader: DataLoader<string, Category>;
  tagsLoader: DataLoader<string, Tag>;
  postCommentsLoader: DataLoader<string, PostComment[]>;
}
