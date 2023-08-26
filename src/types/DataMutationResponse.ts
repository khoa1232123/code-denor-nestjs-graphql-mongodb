import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/user.entity';
import { MutationResponse } from './MutationResponse';
import { Post } from 'src/module/post/post.entity';
import { Category } from 'src/module/category/category.entity';
import { Tag } from 'src/module/tag/tag.entity';
import { PostComment } from 'src/module/post-comment/post-comment.entity';

@ObjectType({ implements: MutationResponse })
export class DataMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  post?: Post;

  @Field({ nullable: true })
  postComment?: PostComment;

  @Field({ nullable: true })
  category?: Category;

  @Field({ nullable: true })
  tag?: Tag;

  @Field((_type) => [Category], { nullable: true })
  categories?: Category[];

  @Field((_type) => [Post], { nullable: true })
  posts?: Post[];

  @Field((_type) => [PostComment], { nullable: true })
  postComments?: PostComment[];

  @Field((_type) => [Tag], { nullable: true })
  tags?: Tag[];

  @Field({ nullable: true })
  count?: number;

  @Field({ nullable: true })
  user?: User;
}
