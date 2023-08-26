import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PostComment } from './post-comment.entity';
import {
  CreatePostCommentInput,
  UpdatePostCommentInput,
} from './post-comment.input';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private postCommentRepository: Repository<PostComment>,
  ) {}

  // DataLoader Comments by Post
  public async getPostCommentsByBatch(
    postIds: readonly string[],
  ): Promise<PostComment[] | any> {
    const comments = await this.getCommentsByPostIds(postIds);
    const mappedResults = this._mapResultToPostIds(postIds, comments);

    return mappedResults;
  }

  async getCommentsByPostIds(
    postIds: readonly string[],
  ): Promise<PostComment[]> {
    const findQuery: any = { $in: postIds };

    return await this.postCommentRepository.find({
      where: { postId: findQuery },
    });
  }

  private _mapResultToPostIds(
    postIds: readonly string[],
    postComments: PostComment[],
  ) {
    return postIds.map(
      (id) =>
        postComments.filter(
          (postComment: PostComment) => postComment.postId === id,
        ) || null,
    );
  }

  async create(
    createPostCommentInput: CreatePostCommentInput,
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
      const postComment = this.postCommentRepository.create({
        id: uuidv4(),
        ...createPostCommentInput,
        userId: req.session.userId,
      });

      const createdPostComment =
        await this.postCommentRepository.save(postComment);

      return {
        code: 200,
        success: true,
        message: 'Create Post Comment successfully',
        postComment: createdPostComment,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async update(
    { id, content }: UpdatePostCommentInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      const postComment = await this.postCommentRepository.findOneBy({ id });
      if (!postComment) {
        return {
          code: 400,
          success: false,
          message: `Comment not found`,
        };
      }

      if (postComment.userId === req.session.userId) {
        return {
          code: 400,
          success: false,
          message: 'You have no authentication',
        };
      }

      if (content) {
        postComment.content = content;
      }

      const updatedPostComment =
        await this.postCommentRepository.save(postComment);

      return {
        code: 200,
        success: true,
        message: 'Update Comment successfully',
        postComment: updatedPostComment,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async delete(
    id: string,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      if (!req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      const existingComment = await this.postCommentRepository.findOneBy({
        id,
      });
      if (!existingComment) {
        return {
          code: 400,
          success: false,
          message: `Comment not found`,
        };
      }

      if (existingComment.userId !== req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `You have no authorized`,
        };
      }

      await this.postCommentRepository.remove(existingComment);

      return {
        code: 200,
        success: true,
        message: 'Comment deleted successfully',
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
