import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Field()
  @Column()
  categoryId!: string;

  @Field((_type) => User)
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
