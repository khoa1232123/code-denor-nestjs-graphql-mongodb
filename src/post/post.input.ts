import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  summary: string;

  @Field()
  published: boolean;

  @Field()
  content: string;

  @Field()
  categoryId: string;
}
