import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { MutationResponse } from './MutationResponse';
import { Post } from 'src/post/post.entity';

@ObjectType({ implements: MutationResponse })
export class DataMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  post?: Post;

  @Field((_type) => [Post], { nullable: true })
  posts?: Post[];

  @Field({ nullable: true })
  user?: User;
}
