import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetCategoriesInput {
  @Field({ defaultValue: 10 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreateCategoryInput {
  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  content: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field()
  id: string;

  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  content: string;
}
