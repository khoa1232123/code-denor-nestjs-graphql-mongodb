import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import {
  CreateProductInput,
  GetProductsInput,
  UpdateProductInput,
} from './product.input';
import { ContextType } from 'src/types/Context';
import { Product, ProductVariant } from './product.entity';
import { Attribute } from '../attribute/attribute.entity';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @ResolveField()
  async variants(
    @Parent() product: Product,
    @Context() { loaders: { attributeLoader } }: ContextType,
  ): Promise<ProductVariant[] | null> {
    let attrIds: string[] = [];
    product.variants.forEach((it) => {
      attrIds.push(it.attributeId);
    });
    let variants = product.variants;
    let attrs = await attributeLoader.loadMany(attrIds);

    if (attrs && attrs.length) {
      product.variants.forEach((it, idx) => {
        const attr = attrs.findIndex(
          (itx: Attribute) => itx?.id === it.attributeId,
        );
        // @ts-ignore
        variants[idx].attribute = attrs[attr] || null;
      });
    }

    return variants;
  }

  // @ResolveField()
  // async variantOptions(
  //   @Parent() product: Product,
  //   @Context() { loaders: { attributeLoader } }: ContextType,
  // ): Promise<ProductVariant[] | null> {
  //   let attrIds: string[] = [];
  //   product.variants.forEach((it) => {
  //     attrIds.push(it.attributeId);
  //   });
  //   let variants = product.variants;
  //   let attrs = await attributeLoader.loadMany(attrIds);

  //   if (attrs && attrs.length) {
  //     product.variants.forEach((it, idx) => {
  //       const attr = attrs.findIndex(
  //         (itx: Attribute) => itx?.id === it.attributeId,
  //       );
  //       // @ts-ignore
  //       variants[idx].attribute = attrs[attr] || null;
  //     });
  //   }

  //   return variants;
  // }

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
