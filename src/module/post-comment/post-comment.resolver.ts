import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PostCommentService } from './post-comment.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import {
  CreatePostCommentInput,
  UpdatePostCommentInput,
} from './post-comment.input';
import { ContextType } from 'src/types/Context';
import { PostComment } from './post-comment.entity';

@Resolver((of) => PostComment)
export class PostCommentResolver {
  constructor(private postCommentService: PostCommentService) {}

  @ResolveField()
  async user(
    @Parent() postComment: PostComment,
    @Context() { loaders: { usersLoader } }: ContextType,
  ) {
    return await usersLoader.load(postComment.userId);
  }

  @Mutation((returns) => DataMutationResponse)
  async createPostComment(
    @Args('createPostCommentInput')
    createPostCommentInput: CreatePostCommentInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postCommentService.create(createPostCommentInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async updatePostComment(
    @Args('updatePostCommentInput')
    updatePostCommentInput: UpdatePostCommentInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postCommentService.update(updatePostCommentInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async deletePostComment(
    @Args('id')
    id: string,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.postCommentService.delete(id, context);
  }
}
