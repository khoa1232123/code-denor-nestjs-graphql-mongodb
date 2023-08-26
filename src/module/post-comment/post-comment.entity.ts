import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

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

  @Field((type) => ID)
  @Column()
  userId: string;

  @Field((type) => User)
  @Column()
  user: User;

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
