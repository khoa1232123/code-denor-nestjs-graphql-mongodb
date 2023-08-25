import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './module/lesson/lesson.entity';
import { LessonModule } from './module/lesson/lesson.module';
import { Post } from './module/post/post.entity';
import { PostModule } from './module/post/post.module';
import { Student } from './module/student/student.entity';
import { StudentModule } from './module/student/student.module';
import { User } from './module/user/user.entity';
import { UserModule } from './module/user/user.module';
import { DataloaderModule } from './module/dataloader/dataloader.module';
import { DataloaderService } from './module/dataloader/dataloader.service';
import { ContextType } from './types/Context';
import { PostCommentModule } from './module/post-comment/post-comment.module';
import { CategoryModule } from './module/category/category.module';
import { Category } from './module/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://khoa1232123:khoa1232123@cluster0.vyqb5dn.mongodb.net/learn-nestjs-api?retryWrites=true&w=majority',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [Lesson, Student, User, Post, Category],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useFactory: (dataloaderService: DataloaderService) => {
        return {
          autoSchemaFile: true,
          context: ({ req, res }): ContextType => ({
            req,
            res,
            loaders: dataloaderService.getLoaders(),
          }),
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        };
      },
      inject: [DataloaderService],
    }),
    LessonModule,
    StudentModule,
    UserModule,
    PostModule,
    PostCommentModule,
    CategoryModule,
  ],
})
export class AppModule {}
