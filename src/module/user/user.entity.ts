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
import { Post } from '../post/post.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: string;

  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field({ defaultValue: '' })
  @Column()
  firstName: string;

  @Field({ defaultValue: '' })
  @Column()
  lastName: string;

  @Field({ defaultValue: '' })
  @Column()
  mobile: string;

  @Column()
  password!: string;

  @Field((_type) => [Post], { nullable: true })
  posts: Post[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
