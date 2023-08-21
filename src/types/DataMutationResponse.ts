import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from './MutationResponse';
import { FieldError } from './FieldError';
import { User } from 'src/user/user.entity';

@ObjectType({ implements: MutationResponse })
export class DataMutationResponse extends MutationResponse {
  // @Field((_type) => ([Post] || Post || User), { nullable: true })
  // data?: Post | User | Post[];

  //   @Field({ nullable: true })
  //   post?: Post;

  //   @Field((_type) => [Post], { nullable: true })
  //   posts?: Post[];

  @Field({ nullable: true })
  user?: User;

  @Field((_type) => [FieldError], { nullable: true })
  errors?: FieldError[];
}
