import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attribute } from '../attribute/attribute.entity';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
@InputType('ProductVariantInput')
export class ProductVariant {
  @Field()
  @Column()
  attributeId: string;

  @Field((_type) => Attribute, { nullable: true })
  attribute: Attribute;

  @Field((_type) => [String], { defaultValue: [], nullable: true })
  @Column({ unique: true })
  values: string[];
}

@ObjectType('Product')
@Entity()
export class Product {
  @ObjectIdColumn()
  _id: string;

  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ unique: true })
  title!: string;

  @Field()
  @Column()
  slug!: string;

  @Field({ nullable: true })
  @Column()
  type: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ default: true })
  published: boolean;

  @Field({ nullable: true, defaultValue: '' })
  @Column()
  image: string;

  @Field()
  @Min(0)
  @Column({ default: 0 })
  price: number;

  @Field()
  @Min(0)
  @Max(100)
  @Column({ default: 0 })
  discount: number;

  @Field()
  @Min(0)
  @Column({ default: 0 })
  quantity: number;

  @Field()
  @Column()
  userId!: string;

  @Field((_type) => User, { nullable: true })
  user: User;

  @Field((_type) => [String], { nullable: true, defaultValue: [] })
  @Column()
  catIds: string[];

  @Field((_type) => [Category], { nullable: true, defaultValue: [] })
  categories: Category[];

  @Field((_type) => [ProductVariant], { nullable: true, defaultValue: [] })
  @Column({ default: [] })
  variants: ProductVariant[];

  @Field((_type) => [VariantOption], { nullable: true, defaultValue: [] })
  @Column({ default: [] })
  variantOptions: VariantOption[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}

@ObjectType()
@Entity()
@InputType('VariantOptionInput')
export class VariantOption {
  @Field((_type) => [VariantOptionItem], { defaultValue: [] })
  variants: VariantOptionItem[];

  @Field()
  title!: string;

  @Field()
  SKU!: string;

  @Field({ defaultValue: '' })
  @Column()
  image: string;

  @Field()
  @Min(0)
  @Column({ default: 0 })
  price: number;

  @Field()
  @Min(0)
  @Max(100)
  @Column({ default: 0 })
  discount: number;

  @Field()
  @Min(0)
  @Column({ default: 0 })
  quantity: number;

  @Field()
  published: boolean;
}

@ObjectType()
@Entity()
@InputType('VariantOptionItemInput')
export class VariantOptionItem {
  @Field()
  attributeId!: string;

  @Field((_type) => Attribute, { nullable: true })
  attribute: Attribute;

  @Field({ defaultValue: '' })
  value!: string;
}
