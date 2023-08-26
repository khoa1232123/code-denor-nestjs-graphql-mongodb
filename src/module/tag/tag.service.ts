import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { handleSlug } from 'src/utils/func';
import { FindManyOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Tag } from './tag.entity';
import { CreateTagInput, GetTagsInput, UpdateTagInput } from './tag.input';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  //   Dataloader Tags
  public async getTagsByBatch(tagIds: readonly string[]): Promise<Tag | any> {
    return await this.getAllTagsByIds(tagIds);
  }

  public async getAllTagsByIds(tagIds: readonly string[]): Promise<Tag[]> {
    const findQuery: any = { $in: tagIds };

    return await this.tagRepository.find({ where: { id: findQuery } });
  }

  async getTags({ limit, page }: GetTagsInput): Promise<DataMutationResponse> {
    try {
      const realLimit = Math.min(50, limit);

      const offset = (Number(page) - 1) * limit;

      const findOptions: FindManyOptions<Tag> = {
        take: realLimit,
        skip: offset,
      };

      const catsAndCount = await this.tagRepository.findAndCount(findOptions);

      return {
        code: 200,
        success: true,
        message: 'Get Categories successfully',
        tags: catsAndCount[0],
        count: catsAndCount[1],
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getTag(id: string): Promise<DataMutationResponse> {
    try {
      const tag = await this.tagRepository.findOneBy({ id });

      return {
        code: 200,
        success: true,
        message: `Get tag with id: ${id} successfully`,
        tag: tag,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async create(
    createTagInput: CreateTagInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    if (!req.session.userId) {
      return {
        code: 400,
        success: false,
        message: 'You have no authentication',
      };
    }

    try {
      const tag = this.tagRepository.create({
        id: uuidv4(),
        ...createTagInput,
        slug: handleSlug(createTagInput.title),
      });

      const createdTag = await this.tagRepository.save(tag);

      return {
        code: 200,
        success: true,
        message: 'Create tag successfully',
        tag: createdTag,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async update(
    { id, title }: UpdateTagInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      if (req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      const existingTag = await this.tagRepository.findOneBy({ id });

      if (!existingTag) {
        return {
          code: 400,
          success: false,
          message: `Post not found`,
        };
      }

      if (title) {
        existingTag.title = title;
      }
      await this.tagRepository.save(existingTag);

      return {
        code: 200,
        success: true,
        message: 'Tag updated successfully',
        tag: existingTag,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async delete(
    id: string,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      if (req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      const existingTag = await this.tagRepository.findOneBy({ id });
      if (!existingTag) {
        return {
          code: 400,
          success: false,
          message: `Tag not found`,
        };
      }

      await this.tagRepository.remove(existingTag);

      return {
        code: 200,
        success: true,
        message: 'Tag deleted successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }
}
