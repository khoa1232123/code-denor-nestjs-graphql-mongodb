import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/user.entity';
import { MutationResponse } from './MutationResponse';
import { Post } from 'src/module/post/post.entity';
import { Category } from 'src/module/category/category.entity';
import { Tag } from 'src/module/tag/tag.entity';
import { PostComment } from 'src/module/post-comment/post-comment.entity';
import { Product } from 'src/module/product/product.entity';
import { ProductCat } from 'src/module/product-cat/product-cat.entity';
import { Attribute } from 'src/module/attribute/attribute.entity';
import { Entity } from 'typeorm';

@ObjectType()
export class MetaInfo {
  @Field({ nullable: true })
  count?: number;

  @Field({ nullable: true })
  pageCurrent?: number;

  @Field({ nullable: true })
  pageTotal?: number;
}

@ObjectType({ implements: MutationResponse })
export class DataMutationResponse extends MutationResponse {
  @Field({ nullable: true })
  post?: Post;

  @Field({ nullable: true })
  product?: Product;

  @Field({ nullable: true })
  attribute?: Attribute;

  @Field({ nullable: true })
  productCat?: ProductCat;

  @Field({ nullable: true })
  postComment?: PostComment;

  @Field({ nullable: true })
  category?: Category;

  @Field({ nullable: true })
  tag?: Tag;

  @Field((_type) => [Category], { nullable: true })
  categories?: Category[];

  @Field((_type) => [ProductCat], { nullable: true })
  productCats?: ProductCat[];

  @Field((_type) => [Post], { nullable: true })
  posts?: Post[];

  @Field((_type) => [Product], { nullable: true })
  products?: Product[];

  @Field((_type) => [Attribute], { nullable: true })
  attributes?: Attribute[];

  @Field((_type) => [PostComment], { nullable: true })
  postComments?: PostComment[];

  @Field((_type) => [Tag], { nullable: true })
  tags?: Tag[];

  @Field({ nullable: true })
  count?: number;

  @Field((_type) => MetaInfo, { nullable: true })
  metaInfo?: MetaInfo;

  @Field({ nullable: true })
  user?: User;
}
