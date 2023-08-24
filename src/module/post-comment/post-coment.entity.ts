import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/module/post/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType('PostComment')
@Entity()
export class PostComment {
  @ObjectIdColumn()
  _id: string;

  @Field((type) => ID)
  @PrimaryColumn()
  id: string;

  @Field((type) => ID)
  @Column()
  postId: string;

  @Field((type) => Post)
  @Column()
  post: Post;

  @Field()
  @Column()
  content: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
