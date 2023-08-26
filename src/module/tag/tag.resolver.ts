import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { Tag } from './tag.entity';
import { CreateTagInput, GetTagsInput, UpdateTagInput } from './tag.input';
import { TagService } from './tag.service';

@Resolver((of) => Tag)
export class TagResolver {
  constructor(private tagService: TagService) {}

  @ResolveField()
  async posts(
    @Parent() tag: Tag,
    @Context() { loaders: { postsWithTagLoader } }: ContextType,
  ) {
    return await postsWithTagLoader.load(tag.id);
  }

  @Query((returns) => DataMutationResponse)
  async getTags(
    @Args('getTagsInput', { nullable: true })
    getTagsInput: GetTagsInput = {},
  ): Promise<DataMutationResponse> {
    return this.tagService.getTags(getTagsInput);
  }

  @Query((returns) => DataMutationResponse)
  async getTag(
    @Args('id')
    id: string,
  ): Promise<DataMutationResponse> {
    return this.tagService.getTag(id);
  }

  @Mutation((returns) => DataMutationResponse)
  async createTag(
    @Args('createTagInput')
    createTagInput: CreateTagInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.tagService.create(createTagInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async updateTag(
    @Args('updateTagInput', { nullable: true })
    updateTagInput: UpdateTagInput,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.tagService.update(updateTagInput, context);
  }

  @Mutation((returns) => DataMutationResponse)
  async deleteTag(
    @Args('id')
    id: string,
    @Context() context: ContextType,
  ): Promise<DataMutationResponse> {
    return this.tagService.delete(id, context);
  }
}
