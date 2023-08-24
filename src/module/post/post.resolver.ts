import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { Post } from './post.entity';
import { CreatePostInput, GetPostsInput, UpdatePostInput } from './post.input';
import { PostService } from './post.service';

@Resolver((of) => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @ResolveField()
  async users(
    @Parent() post: Post,
    @Context() { loaders: { usersLoader } }: ContextType,
  ) {
    const users = await usersLoader.load(post.userId);
    return users;
  }

  @Mutation((returns) => DataMutationResponse)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postService.create(createPostInput, context);
  }

  @Query((returns) => DataMutationResponse)
  async getPosts(
    @Args('getPostsInput', { nullable: true })
    getPostsInput: GetPostsInput = {},
  ): Promise<DataMutationResponse> {
    return this.postService.getPosts(getPostsInput);
  }

  @Query((returns) => DataMutationResponse)
  async getPost(
    @Args('id')
    id: string,
  ): Promise<DataMutationResponse> {
    return this.postService.getPost(id);
  }

  @Mutation((returns) => DataMutationResponse)
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postService.updatePost(updatePostInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async deletePost(
    @Args('id') id: string,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postService.deletePost(id, context);
  }
}
