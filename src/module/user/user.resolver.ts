import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { ContextType } from '../../types/Context';
import { User } from './user.entity';
import {
  ChangePasswordInput,
  ChangePasswordWhenForgotInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from './user.input';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @ResolveField()
  async posts(
    @Parent() user: User,
    @Context() { loaders: { postsWithUserLoader } }: ContextType,
  ) {
    const posts = await postsWithUserLoader.load(user.id);

    return posts;
  }

  @Query((returns) => DataMutationResponse)
  async me(@Context() context: ContextType): Promise<DataMutationResponse> {
    return this.userService.me(context);
  }

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
    return this.userService.login(loginInput, context);
  }

  @Mutation((returns) => Boolean)
  async logout(@Context() context: ContextType): Promise<Boolean> {
    return this.userService.logout(context);
  }

  @Mutation((returns) => DataMutationResponse)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.userService.forgotPassword(forgotPasswordInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async changePassword(
    @Args('changePasswordInput')
    changePasswordInput: ChangePasswordInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.userService.changePassword(changePasswordInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async changePasswordWhenForgot(
    @Args('changePasswordWhenForgotInput')
    changePasswordWhenForgotInput: ChangePasswordWhenForgotInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.userService.changePasswordWhenForgot(
      changePasswordWhenForgotInput,
      context,
    );
  }
}
