import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validateRegisterInput } from 'src/utils/validateRegisterInput';
import { LoginInput, RegisterInput } from './user.input';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { v4 as uuidv4 } from 'uuid';
import { ContextType } from 'src/types/Context';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register({
    email,
    password,
    username,
  }: RegisterInput): Promise<DataMutationResponse> {
    const validateRegisterInputErrors = validateRegisterInput({
      email,
      password,
      username,
    });

    if (validateRegisterInputErrors) {
      return {
        code: 400,
        success: false,
        ...validateRegisterInputErrors,
      };
    }

    try {
      const query: any = { $or: [{ username }, { email }] };
      const existingUser = await this.userRepository.findOne(query);

      if (existingUser) {
        return {
          code: 400,
          success: false,
          message: 'Duplicated username or email',
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: `${
                existingUser.username === username ? 'Username' : 'Email'
              } already taken`,
            },
          ],
        };
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = this.userRepository.create({
        id: uuidv4(),
        username,
        password: hashedPassword,
        email,
      });

      const createdUser = await this.userRepository.save(newUser);

      return {
        code: 200,
        success: true,
        message: 'User registration successfully',
        user: createdUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async login(
    { usernameOrEmail, password }: LoginInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      const existingUser = await this.userRepository.findOneBy(
        usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail },
      );
      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: `User not found`,
          errors: [
            {
              field: 'usernameOrEmail',
              message: 'Username or email incorrect',
            },
          ],
        };
      }
      const passwordValid = await argon2.verify(
        existingUser.password,
        password,
      );

      if (!passwordValid) {
        return {
          code: 500,
          success: false,
          message: `User not found`,
          errors: [
            {
              field: 'password',
              message: 'password wrong!',
            },
          ],
        };
      }

      // Create Session and return Cookie
      //   req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: `Logged in successfully`,
        user: existingUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }
}
