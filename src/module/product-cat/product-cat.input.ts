import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetProductCatsInput {
  @Field({ defaultValue: 10 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreateProductCatInput {
  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  content: string;
}

@InputType()
export class UpdateProductCatInput {
  @Field()
  id: string;

  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  content: string;
}
