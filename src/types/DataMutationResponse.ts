import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/user.entity';
import { MutationResponse } from './MutationResponse';
import { Post } from 'src/module/post/post.entity';
import { Category } from 'src/module/category/category.entity';

@ObjectType({ implements: MutationResponse })
export class DataMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  post?: Post;

  @Field({ nullable: true })
  category?: Category;

  @Field((_type) => [Category], { nullable: true })
  categories?: Category[];

  @Field((_type) => [Post], { nullable: true })
  posts?: Post[];

  @Field({ nullable: true })
  count?: number;

  @Field({ nullable: true })
  user?: User;
}
