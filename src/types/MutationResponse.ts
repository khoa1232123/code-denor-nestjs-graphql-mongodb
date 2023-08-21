import { Field, InterfaceType } from '@nestjs/graphql';
import { FieldError } from './FieldError';

@InterfaceType()
export abstract class MutationResponse {
  @Field()
  code: number;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field((_type) => [FieldError], { nullable: true })
  errors?: FieldError[];
}
