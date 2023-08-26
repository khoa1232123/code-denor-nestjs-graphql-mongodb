import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetPostsInput {
  @Field({ defaultValue: 5 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreatePostInput {
  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  summary: string;

  @Field({ defaultValue: true })
  published: boolean;

  @Field({ defaultValue: '' })
  content: string;

  @Field((_type) => [String], { defaultValue: [] })
  postCatIds?: string[];

  @Field((_type) => [String], { defaultValue: [] })
  postTagIds?: string[];
}

@InputType()
export class UpdatePostInput {
  @Field({ defaultValue: '' })
  id: string;

  @Field({ defaultValue: '' })
  title?: string;

  @Field({ defaultValue: '' })
  summary?: string;

  @Field({ nullable: true })
  published?: boolean;

  @Field({ defaultValue: '' })
  content?: string;

  @Field((_type) => [String], { defaultValue: [] })
  postCatIds?: string[];

  @Field((_type) => [String], { defaultValue: [] })
  postTagIds?: string[];
}
