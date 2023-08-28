import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttributeService } from './attribute.service';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import {
  CreateAttributeInput,
  GetAttributesInput,
  UpdateAttributeInput,
} from './attribute.input';
import { ContextType } from 'src/types/Context';

@Resolver()
export class AttributeResolver {
  constructor(private attributeService: AttributeService) {}

  @Query((returns) => DataMutationResponse)
  async getAttributes(
    @Args('getAttributesInput') getAttributesInput: GetAttributesInput,
  ): Promise<DataMutationResponse> {
    return this.attributeService.getAttributes(getAttributesInput);
  }

  @Query((returns) => DataMutationResponse)
  async getAttribute(@Args('id') id: string): Promise<DataMutationResponse> {
    return this.attributeService.getAttribute(id);
  }

  @Mutation((returns) => DataMutationResponse)
  async createAttribute(
    @Args('createAttributeInput')
    createAttributeInput: CreateAttributeInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.attributeService.create(createAttributeInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async updateAttribute(
    @Args('updateAttributeInput')
    updateAttributeInput: UpdateAttributeInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.attributeService.update(updateAttributeInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async deleteAttribute(
    @Args('id')
    id: string,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.attributeService.delete(id, context);
  }
}
