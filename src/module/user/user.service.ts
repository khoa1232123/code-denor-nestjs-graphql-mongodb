import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { sendEmail } from 'src/utils/sendEmail';
import { validateRegisterInput } from 'src/utils/validateRegisterInput';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import {
  ChangePasswordInput,
  ChangePasswordWhenForgotInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from './user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async getAllUsersByIds(userIds: readonly string[]): Promise<User[]> {
    const findQuery: any = { $in: userIds };
    return await this.userRepository.find({ where: { id: findQuery } });
  }

  public async getUsersByBatch(
    userIds: readonly string[],
  ): Promise<User | any> {
    const users = await this.getAllUsersByIds(userIds);
    const mappedResults = this._mapResultToIds(userIds, users);
    return mappedResults;
  }

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
      req.session.userId = existingUser.id;

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

  async me({ req }: ContextType): Promise<DataMutationResponse> {
    try {
      if (!req.session.userId) {
        return {
          code: 400,
          success: false,
          message: `Ban can login`,
        };
      }

      const user = await this.userRepository.findOneBy({
        id: req.session.userId,
      });

      return {
        code: 200,
        success: true,
        message: `get user successfully`,
        user: user,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  private _mapResultToIds(userIds: readonly string[], users: User[]) {
    return userIds.map(
      (id) => users.filter((user: User) => user.id === id) || null,
    );
  }

  async logout({ req, res }: ContextType): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      req.session.destroy((error) => {
        if (error) {
          console.log('Detroying session error', error);
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    if (changePasswordInput.newPassword.length <= 2) {
      return {
        code: 400,
        success: false,
        message: 'Invalid password',
        errors: [
          { field: 'password', message: 'Length must be greater than 2' },
        ],
      };
    }

    try {
      const userId = req.session?.userId;

      if (!userId) {
        return {
          code: 400,
          success: false,
          message: `User no longer exists`,
          errors: [{ field: 'password', message: 'User no longer exists' }],
        };
      }

      const user = await this.userRepository.findOneBy({ id: userId });

      const verifyPassword = await argon2.verify(
        user.password,
        changePasswordInput.oldPassword,
      );

      if (!verifyPassword) {
        return {
          code: 400,
          success: false,
          message: `Old Password is wrong`,
          errors: [{ field: 'password', message: 'Old Password is wrong' }],
        };
      }

      const updatedPassword = await argon2.hash(
        changePasswordInput.newPassword,
      );

      await User.update({ id: userId }, { password: updatedPassword });

      return {
        code: 200,
        success: true,
        message: `User password reset successfully`,
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

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      const user = await this.userRepository.findOneBy({
        email: forgotPasswordInput.email,
      });

      if (!user)
        return {
          code: 400,
          success: false,
          message: `email khong dung ban can, ban co the dien lai email`,
        };

      let token = uuidv4();

      const hashResetToken = await argon2.hash(token);

      req.session.token = hashResetToken;

      const link = await sendEmail(
        forgotPasswordInput.email,
        ` <a href="http://localhost:3000/auth/change-password?token=${token}&userId=${user.id}">Click here to reset your password</a>`,
      );

      return {
        code: 200,
        success: true,
        message: `Chung toi vua gui cho ban 1 email ban co the vao gmail de kiem tra ${link}`,
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

  async changePasswordWhenForgot(
    changePasswordWhenForgotInput: ChangePasswordWhenForgotInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    if (changePasswordWhenForgotInput.newPassword.length <= 2) {
      return {
        code: 400,
        success: false,
        message: 'Invalid password',
        errors: [
          { field: 'password', message: 'Length must be greater than 2' },
        ],
      };
    }

    try {
      const token = req.session.token;

      if (!token) {
        return {
          code: 400,
          success: false,
          message: `Invalid or expired password reset token`,
          errors: [
            {
              field: 'token',
              message: 'Invalid or expired password reset token',
            },
          ],
        };
      }

      const resetPasswordTokenValid = await argon2.verify(
        token,
        changePasswordWhenForgotInput.token,
      );

      if (!resetPasswordTokenValid) {
        return {
          code: 400,
          success: false,
          message: `Invalid or expired password reset token`,
          errors: [
            {
              field: 'token',
              message: 'Invalid or expired password reset token',
            },
          ],
        };
      }

      const userId = changePasswordWhenForgotInput.userId;

      const user = await User.findOneBy({ id: userId });

      req.session.token = '';

      if (!user) {
        return {
          code: 400,
          success: false,
          message: `User no longer exists`,
          errors: [{ field: 'token', message: 'User no longer exists' }],
        };
      }

      const updatedPassword = await argon2.hash(
        changePasswordWhenForgotInput.newPassword,
      );

      await User.update({ id: userId }, { password: updatedPassword });

      return {
        code: 200,
        success: true,
        message: `User password reset successfully`,
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
