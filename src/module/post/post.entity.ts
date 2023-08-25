import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/module/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@ObjectType('Post')
@Entity()
export class Post {
  @ObjectIdColumn()
  _id: string;

  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  userId!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  slug!: string;

  @Field()
  @Column()
  summary: string;

  @Field()
  @Column({ default: true })
  published: boolean;

  @Field()
  @Column()
  content: string;

  @Field((_type) => User, { nullable: true })
  user: User;

  @Field((_type) => [String], { defaultValue: [] })
  @Column()
  postCatIds: string[];

  @Field((_type) => [Category], { nullable: true, defaultValue: [] })
  categories: Category[];

  @Field((_type) => [String], { defaultValue: [] })
  @Column()
  postTags: string[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
