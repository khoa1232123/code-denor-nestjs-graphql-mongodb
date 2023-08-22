import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson/lesson.entity';
import { LessonModule } from './lesson/lesson.module';
import { Post } from './post/post.entity';
import { PostModule } from './post/post.module';
import { Student } from './student/student.entity';
import { StudentModule } from './student/student.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/dataloader.service';
import { ContextType } from './types/Context';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://khoa1232123:khoa1232123@cluster0.vyqb5dn.mongodb.net/learn-nestjs-api?retryWrites=true&w=majority',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [Lesson, Student, User, Post],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      // autoSchemaFile: true,
      driver: ApolloDriver,
      // playground: false,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
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
    // DataloaderModule,
  ],
})
export class AppModule {}
