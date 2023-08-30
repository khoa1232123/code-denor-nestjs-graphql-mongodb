import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import {
  CreateProductInput,
  GetProductsInput,
  UpdateProductInput,
} from './product.input';
import { ContextType } from 'src/types/Context';

@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query((returns) => DataMutationResponse)
  async getProducts(
    @Args('getProductsInput', { nullable: true, defaultValue: {} })
    getProductsInput: GetProductsInput,
  ): Promise<DataMutationResponse> {
    return this.productService.getProducts(getProductsInput);
  }

  @Query((returns) => DataMutationResponse)
  async getProduct(@Args('id') id: string): Promise<DataMutationResponse> {
    return this.productService.getProduct(id);
  }

  @Mutation((returns) => DataMutationResponse)
  async createProduct(
    @Args('createProductInput')
    createProductInput: CreateProductInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.productService.create(createProductInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async updateProduct(
    @Args('updateProductInput')
    updateProductInput: UpdateProductInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.productService.update(updateProductInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async deleteProduct(
    @Args('id')
    id: string,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.productService.delete(id, context);
  }
}
