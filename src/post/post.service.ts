import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostInput } from './post.input';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { v4 as uuidv4 } from 'uuid';
import { handleSlug } from 'src/utils/func';

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
}
