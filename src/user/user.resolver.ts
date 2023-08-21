import { Req, Session, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  GqlContextType,
} from '@nestjs/graphql';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { User } from './user.entity';
import { LoginInput, RegisterInput } from './user.input';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Session as ExpressSession, SessionData } from 'express-session';
import { Request, Response } from 'express';
import { ContextType } from '../types/Context';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Mutation((returns) => DataMutationResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<DataMutationResponse> {
    return this.userService.register(registerInput);
  }

  @Mutation((returns) => DataMutationResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    context.req.session.userId = context.req.session.userId
      ? context.req.session.userId + 1
      : 1;
    console.log({ session: context.req.session });

    return this.userService.login(loginInput, context);
  }
}
