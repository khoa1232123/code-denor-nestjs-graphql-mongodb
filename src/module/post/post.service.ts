import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { handleSlug } from 'src/utils/func';
import { FindManyOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Post } from './post.entity';
import { CreatePostInput, GetPostsInput, UpdatePostInput } from './post.input';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  // DataLoader Posts by User
  public async getPostsByUserByBatch(
    userIds: readonly string[],
  ): Promise<Post[] | any> {
    const posts = await this.getPostsByUserIds(userIds);
    const mappedResults = this._mapResultToUserIds(userIds, posts);

    return mappedResults;
  }

  async getPostsByUserIds(userIds: readonly string[]): Promise<Post[]> {
    const findQuery: any = { $in: userIds };

    return await this.postRepository.find({ where: { userId: findQuery } });
  }

  private _mapResultToUserIds(userIds: readonly string[], posts: Post[]) {
    return userIds.map(
      (id) => posts.filter((post: Post) => post.userId === id) || null,
    );
  }

  // DataLoader Posts by Cat
  public async getPostsByCatByBatch(
    catIds: readonly string[],
  ): Promise<Post[] | any> {
    const posts = await this.getPostsByCatIds(catIds);
    const mappedResults = this._mapResultToCatIds(catIds, posts);

    return mappedResults;
  }

  async getPostsByCatIds(catIds: readonly string[]): Promise<Post[]> {
    const findQuery: any = { $in: catIds };

    return await this.postRepository.find({ where: { postCatIds: findQuery } });
  }

  private _mapResultToCatIds(catIds: readonly string[], posts: Post[]) {
    return catIds.map(
      (id) =>
        posts.filter((post: Post) => post.postCatIds.includes(id)) || null,
    );
  }

  // DataLoader Posts by Cat
  public async getPostsByTagByBatch(
    tagIds: readonly string[],
  ): Promise<Post[] | any> {
    const posts = await this.getPostsByTagIds(tagIds);
    const mappedResults = this._mapResultToTagIds(tagIds, posts);

    return mappedResults;
  }

  async getPostsByTagIds(tagIds: readonly string[]): Promise<Post[]> {
    const findQuery: any = { $in: tagIds };

    return await this.postRepository.find({ where: { postTagIds: findQuery } });
  }

  private _mapResultToTagIds(tagIds: readonly string[], posts: Post[]) {
    return tagIds.map(
      (id) =>
        posts.filter((post: Post) => post.postTagIds.includes(id)) || null,
    );
  }

  async create(
    createPostInput: CreatePostInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    if (!req.session.userId) {
      return {
        code: 400,
        success: false,
        message: 'You have no authentication',
      };
    }

    try {
      const post = this.postRepository.create({
        id: uuidv4(),
        ...createPostInput,
        slug: handleSlug(createPostInput.title),
        userId: req.session.userId,
      });

      const createdPost = await this.postRepository.save(post);

      return {
        code: 200,
        success: true,
        message: 'Create Post successfully',
        post: createdPost,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getPosts({
    limit,
    page,
  }: GetPostsInput): Promise<DataMutationResponse> {
    try {
      const realLimit = Math.min(10, limit);

      const offset = (Number(page) - 1) * limit;

      const findOptions: FindManyOptions<Post> = {
        take: realLimit,
        skip: offset,
      };

      const postsAndCount = await this.postRepository.findAndCount(findOptions);

      return {
        code: 200,
        success: true,
        message: 'Get Posts successfully',
        posts: postsAndCount[0],
        count: postsAndCount[1],
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getPost(id: string): Promise<DataMutationResponse> {
    try {
      const post = await this.postRepository.findOneBy({ id });

      return {
        code: 200,
        success: true,
        message: `Get Post with id: ${id} successfully`,
        post: post,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async updatePost(
    {
      id,
      title,
      postCatIds,
      postTagIds,
      content,
      published,
      summary,
    }: UpdatePostInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      const existingPost = await this.postRepository.findOneBy({ id });

      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: `Post not found`,
        };
      }

      if (existingPost.userId !== req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      if (title) {
        existingPost.title = title;
      }
      if (postCatIds && postCatIds.length) {
        existingPost.postCatIds = postCatIds;
      }
      if (postTagIds && postTagIds.length) {
        existingPost.postTagIds = postTagIds;
      }
      if (content) {
        existingPost.content = content;
      }
      if (typeof published === 'boolean') {
        existingPost.published = published;
      }
      if (summary) {
        existingPost.summary = summary;
      }

      await this.postRepository.save(existingPost);

      return {
        code: 200,
        success: true,
        message: 'Post updated successfully',
        post: existingPost,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async deletePost(
    id: string,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      const existingPost = await this.postRepository.findOneBy({ id });
      if (!existingPost) {
        return {
          code: 400,
          success: false,
          message: `Post not found`,
        };
      }

      if (existingPost.userId !== req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      await this.postRepository.remove(existingPost);

      return {
        code: 200,
        success: true,
        message: 'Post deleted successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }
}
