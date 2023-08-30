import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductCatService } from './product-cat.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import {
  CreateProductCatInput,
  GetProductCatsInput,
  UpdateProductCatInput,
} from './product-cat.input';
import { ContextType } from 'src/types/Context';
import { ProductCat } from './product-cat.entity';

@Resolver()
export class ProductCatResolver {
  constructor(private productCatService: ProductCatService) {}

  @Query((returns) => DataMutationResponse)
  async getProductCats(
    @Args('getProductCatsInput', { nullable: true, defaultValue: {} })
    getProductCatsInput: GetProductCatsInput,
  ): Promise<DataMutationResponse> {
    return this.productCatService.getProductCats(getProductCatsInput);
  }

  @Query((returns) => DataMutationResponse)
  async getProductCat(@Args('id') id: string): Promise<DataMutationResponse> {
    return this.productCatService.getProductCat(id);
  }

  @Mutation((returns) => DataMutationResponse)
  async createProductCat(
    @Args('createProductCatInput')
    createProductCatInput: CreateProductCatInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.productCatService.create(createProductCatInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async updateProductCat(
    @Args('updateProductCatInput')
    updateProductCatInput: UpdateProductCatInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.productCatService.update(updateProductCatInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async deleteProductCat(
    @Args('id')
    id: string,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.productCatService.delete(id, context);
  }
}
