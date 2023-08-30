import { Field, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ProductVariant, VariantOptions } from './product.entity';

@InputType()
export class GetProductsInput {
  @Field({ defaultValue: 10 })
  limit?: number;

  @Field({ defaultValue: 1 })
  page?: number;
}

@InputType()
export class CreateProductInput {
  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  content: string;

  @Field({ defaultValue: true })
  published: boolean;

  @Field({ defaultValue: '' })
  image: string;

  @Field({ defaultValue: 0 })
  @Min(0)
  price: number;

  @Field({ defaultValue: 0 })
  @Min(0)
  @Max(100)
  discount: number;

  @Field({ defaultValue: 0 })
  @Min(0)
  quantity: number;

  @Field((_type) => [ProductVariant], { nullable: true, defaultValue: [] })
  variants: ProductVariant[];

  @Field((_type) => [VariantOptions], { nullable: true, defaultValue: [] })
  variantOptions: VariantOptions[];
}

@InputType()
export class UpdateProductInput {
  @Field()
  id!: string;

  @Field({ defaultValue: '' })
  title: string;

  @Field({ defaultValue: '' })
  content: string;

  @Field({ defaultValue: true })
  published: boolean;

  @Field({ defaultValue: '' })
  image: string;

  @Field({ defaultValue: 0 })
  @Min(0)
  price: number;

  @Field({ defaultValue: 0 })
  @Min(0)
  @Max(100)
  discount: number;

  @Field({ defaultValue: 0 })
  @Min(0)
  quantity: number;

  @Field((_type) => [ProductVariant], { nullable: true, defaultValue: [] })
  variants: ProductVariant[];

  @Field((_type) => [VariantOptions], { nullable: true, defaultValue: [] })
  variantOptions: VariantOptions[];
}
