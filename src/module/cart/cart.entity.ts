import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/user.entity';
import { Product } from 'src/module/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
@InputType('CartItemInput')
export class CartItem {
  @Field()
  @Column()
  productId!: string;

  @Field((_type) => Product, { nullable: true })
  product: Product;

  @Field()
  @Column()
  quality: number;
}

@ObjectType()
@Entity()
export class Cart {
  @ObjectIdColumn()
  _id: string;

  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  userId!: string;

  @Field((_type) => User, { nullable: true })
  user: User;

  @Field((_type) => [CartItem], { defaultValue: [] })
  @Column()
  cartItems!: CartItem[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
