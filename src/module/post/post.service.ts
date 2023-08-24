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
    { id, title, postCatIds, content, published, summary }: UpdatePostInput,
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