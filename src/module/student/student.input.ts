import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @MinLength(1)
  @Field()
  firstName: string;

  @MinLength(1)
  @Field()
  lastName: string;

  @MinLength(1)
  @IsEmail()
  @Field()
  email: string;

  @MinLength(6)
  @Field()
  password: string;
}
