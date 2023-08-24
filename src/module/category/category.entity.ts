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

@ObjectType('Category')
@Entity()
export class Category {
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
