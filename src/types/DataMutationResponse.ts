import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { MutationResponse } from './MutationResponse';

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
}
