import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetPostCommentsInput {
  @Field({ defaultValue: 5 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreatePostCommentInput {
  @Field()
  postId: string;

  @Field({ defaultValue: '' })
  content: string;
}

@InputType()
export class UpdatePostCommentInput {
  @Field()
  id: string;

  @Field({ defaultValue: '' })
  content: string;
}
