import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { IDataloaders } from './dataloader.interface';
import { UserService } from 'src/module/user/user.service';
import { User } from 'src/module/user/user.entity';
import { Category } from '../category/category.entity';
import { CategoryService } from '../category/category.service';
import { PostService } from '../post/post.service';
import { Post } from '../post/post.entity';
import { TagService } from '../tag/tag.service';
import { Tag } from '../tag/tag.entity';
import { PostCommentService } from '../post-comment/post-comment.service';
import { PostComment } from '../post-comment/post-comment.entity';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly catService: CategoryService,
    private readonly tagService: TagService,
    private readonly postCommentService: PostCommentService,
  ) {}

  getLoaders(): IDataloaders {
    const usersLoader = this._createUsersLoader();
    const catsLoader = this._createCatsLoader();
    const tagsLoader = this._createTagsLoader();
    const postsWithUserLoader = this._createPostsWithUserLoader();
    const postsWithCatLoader = this._createPostsWithCatLoader();
    const postsWithTagLoader = this._createPostsWithTagLoader();
    const postCommentsLoader = this._createPostCommentsLoader();

    return {
      postsWithUserLoader,
      postsWithCatLoader,
      postsWithTagLoader,
      usersLoader,
      catsLoader,
      tagsLoader,
      postCommentsLoader,
    };
  }

  private _createUsersLoader() {
    return new DataLoader<string, User>(
      async (keys: readonly string[]) =>
        await this.userService.getUsersByBatch(keys as string[]),
    );
  }

  private _createPostsWithUserLoader() {
    return new DataLoader<string, Post[]>(
      async (keys: readonly string[]) =>
        await this.postService.getPostsByUserByBatch(keys as string[]),
    );
  }

  private _createPostsWithCatLoader() {
    return new DataLoader<string, Post[]>(
      async (keys: readonly string[]) =>
        await this.postService.getPostsByCatByBatch(keys as string[]),
    );
  }

  private _createPostsWithTagLoader() {
    return new DataLoader<string, Post[]>(
      async (keys: readonly string[]) =>
        await this.postService.getPostsByTagByBatch(keys as string[]),
    );
  }

  private _createCatsLoader() {
    return new DataLoader<string, Category>(
      async (keys: readonly string[]) =>
        await this.catService.getCatsByBatch(keys as string[]),
    );
  }

  private _createTagsLoader() {
    return new DataLoader<string, Tag>(
      async (keys: readonly string[]) =>
        await this.tagService.getTagsByBatch(keys as string[]),
    );
  }

  private _createPostCommentsLoader() {
    return new DataLoader<string, PostComment[]>(
      async (keys: readonly string[]) =>
        await this.postCommentService.getPostCommentsByBatch(keys as string[]),
    );
  }
}
