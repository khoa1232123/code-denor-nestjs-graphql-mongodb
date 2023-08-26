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
import { Post } from '../post/post.entity';

@ObjectType('Tag')
@Entity()
export class Tag {
  @ObjectIdColumn()
  _id: string;

  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  slug!: string;

  @Field((_type) => [Post], { nullable: true })
  posts: Post[];
}
