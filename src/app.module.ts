import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from './module/attribute/attribute.module';
import { Category } from './module/category/category.entity';
import { CategoryModule } from './module/category/category.module';
import { DataloaderModule } from './module/dataloader/dataloader.module';
import { DataloaderService } from './module/dataloader/dataloader.service';
import { PostComment } from './module/post-comment/post-comment.entity';
import { PostCommentModule } from './module/post-comment/post-comment.module';
import { Post } from './module/post/post.entity';
import { PostModule } from './module/post/post.module';
import { ProductCatModule } from './module/product-cat/product-cat.module';
import { ProductReviewModule } from './module/product-review/product-review.module';
import { ProductModule } from './module/product/product.module';
import { Tag } from './module/tag/tag.entity';
import { TagModule } from './module/tag/tag.module';
import { User } from './module/user/user.entity';
import { UserModule } from './module/user/user.module';
import { ContextType } from './types/Context';
import { ProductCat } from './module/product-cat/product-cat.entity';
import { Attribute } from './module/attribute/attribute.entity';
import { Product } from './module/product/product.entity';
import { CartModule } from './module/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://khoa1232123:khoa1232123@cluster0.vyqb5dn.mongodb.net/learn-nestjs-api?retryWrites=true&w=majority',
      synchronize: true,
      useUnifiedTopology: true,
      entities: [
        User,
        Post,
        Category,
        Tag,
        PostComment,
        ProductCat,
        Attribute,
        Product,
      ],
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
    UserModule,
    PostModule,
    PostCommentModule,
    CategoryModule,
    TagModule,
    ProductModule,
    AttributeModule,
    ProductCatModule,
    ProductReviewModule,
    CartModule,
  ],
})
export class AppModule {}
