import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetAttributesInput {
  @Field({ defaultValue: 10 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreateAttributeInput {
  @Field({ defaultValue: '' })
  title: string;

  @Field((_type) => [String], { defaultValue: [] })
  values: string[];

  @Field({ defaultValue: '' })
  content: string;
}

@InputType()
export class UpdateAttributeInput {
  @Field()
  id: string;

  @Field({ defaultValue: '' })
  title: string;

  @Field((_type) => [String], { defaultValue: [] })
  values: string[];

  @Field({ defaultValue: '' })
  content: string;
}
