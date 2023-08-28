import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Max, Min } from 'class-validator';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
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

  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ default: true })
  published: boolean;

  @Field()
  @Column()
  userId!: string;

  @Field((_type) => User, { nullable: true })
  user: User;

  @Field()
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

  @Field((_type) => [ProductVariant], { nullable: true })
  @Column({ default: [] })
  variants: ProductVariant[];

  @Field((_type) => [VariantOptions], { nullable: true })
  @Column({ default: [] })
  variantOptions: VariantOptions[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}

@ObjectType()
@Entity()
class ProductVariant {
  @Field()
  id!: string;

  @Field()
  title!: string;

  @Field((_type) => [VariantValueItem], { defaultValue: [], nullable: true })
  values: string[];
}

@ObjectType()
@Entity()
class VariantValueItem {
  @Field()
  id!: number;

  @Field({ defaultValue: '' })
  value!: string;
}

@ObjectType()
@Entity()
class VariantOptions {
  @Field()
  attributeId!: string;

  @Field()
  attributeValue!: string;

  @Field((_type) => [String], { defaultValue: [] })
  variants: string[];

  @Field()
  title!: string;

  @Field((_type) => [String], { nullable: true })
  values: string[];

  @Field()
  SKU!: string;

  @Field()
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
class VariantInOptions extends ProductVariant {}
