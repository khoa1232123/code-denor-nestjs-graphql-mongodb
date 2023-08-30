import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
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
@InputType('ProductVariantInput')
export class ProductVariant {
  @Field()
  @Column()
  attributeId: string;

  @Field((_type) => [String], { defaultValue: [], nullable: true })
  @Column({ unique: true })
  values: string[];
}

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

  @Field((_type) => [ProductVariant], { nullable: true, defaultValue: [] })
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
@InputType('VariantOptionsInput')
export class VariantOptions {
  @Field((_type) => [VariantOptionItem], { defaultValue: [] })
  variants: VariantOptionItem[];

  @Field()
  title!: string;

  @Field((_type) => [String], { nullable: true })
  values: string[];

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

  @Field({ defaultValue: '' })
  value!: string;
}
