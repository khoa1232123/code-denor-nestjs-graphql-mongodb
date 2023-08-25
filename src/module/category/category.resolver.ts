import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import {
  CreateCategoryInput,
  GetCategoriesInput,
  UpdateCategoryInput,
} from './category.input';
import { ContextType } from 'src/types/Context';

@Resolver()
export class CategoryResolver {
  constructor(private catService: CategoryService) {}

  @Query((returns) => DataMutationResponse)
  async getCategories(
    @Args('getCategoriesInput') getCategoriesInput: GetCategoriesInput,
  ): Promise<DataMutationResponse> {
    return this.catService.getCategories(getCategoriesInput);
  }

  @Query((returns) => DataMutationResponse)
  async getCategory(@Args('id') id: string): Promise<DataMutationResponse> {
    return this.catService.getCategory(id);
  }

  @Mutation((returns) => DataMutationResponse)
  async createCategory(
    @Args('createCategoryInput', { nullable: true })
    createCategoryInput: CreateCategoryInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.catService.create(createCategoryInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async updateCategory(
    @Args('updateCategoryInput', { nullable: true })
    updateCategoryInput: UpdateCategoryInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.catService.create(updateCategoryInput, context);
  }
}
