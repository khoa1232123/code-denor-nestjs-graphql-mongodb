import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentType } from 'src/module/_cho/student/student.type';

@ObjectType('Lesson')
@Entity()
export class Lesson {
  @ObjectIdColumn()
  _id: string;

  @Field((type) => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  startDate: string;

  @Field()
  @Column()
  endDate: string;

  @Field((type) => [StudentType])
  @Column()
  students: string[];
}
