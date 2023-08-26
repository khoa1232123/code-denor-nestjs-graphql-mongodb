import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetTagsInput {
  @Field({ defaultValue: 10 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreateTagInput {
  @Field({ defaultValue: '' })
  title: string;
}

@InputType()
export class UpdateTagInput {
  @Field()
  id: string;

  @Field({ defaultValue: '' })
  title: string;
}
