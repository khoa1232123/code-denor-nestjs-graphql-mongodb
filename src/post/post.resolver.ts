import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { CreatePostInput } from './post.input';
import { ContextType } from 'src/types/Context';
import { User } from 'src/user/user.entity';
import { Post } from './post.entity';
import { UserService } from '../user/user.service';

@Resolver((of) => Post)
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

  @ResolveField()
  async user(@Parent() post: Post) {
    console.log({ post });
    return this.userService.getUserById(post.userId);
  }

  @Mutation((returns) => DataMutationResponse)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postService.create(createPostInput, context);
  }

  @Query((returns) => DataMutationResponse)
  async getPosts(): Promise<DataMutationResponse> {
    return this.postService.getPosts();
  }
}
