import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { CreatePostInput } from './post.input';
import { ContextType } from 'src/types/Context';

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Mutation((returns) => DataMutationResponse)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postService.create(createPostInput, context);
  }
}
