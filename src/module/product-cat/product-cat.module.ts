import { Module } from '@nestjs/common';
import { ProductCatService } from './product-cat.service';
import { ProductCatResolver } from './product-cat.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCat } from './product-cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCat])],
  providers: [ProductCatService, ProductCatResolver],
})
export class ProductCatModule {}
