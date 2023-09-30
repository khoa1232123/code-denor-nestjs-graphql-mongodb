import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateCategoryInput,
  GetCategoriesInput,
  UpdateCategoryInput,
} from './category.input';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { v4 as uuidv4 } from 'uuid';
import { handleSlug } from 'src/utils/func';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private catRepository: Repository<Category>,
  ) {}

  //   Dataloader Categories
  public async getCatsByBatch(
    catIds: readonly string[],
  ): Promise<Category | any> {
    const cats = await this.getAllCatsByIds(catIds);
    return cats;
  }

  public async getAllCatsByIds(catIds: readonly string[]): Promise<Category[]> {
    const findQuery: any = { $in: catIds };

    return await this.catRepository.find({ where: { id: findQuery } });
  }

  async getCategories({
    limit = 10,
    page = 1,
  }: GetCategoriesInput): Promise<DataMutationResponse> {
    try {
      const realLimit = Math.min(20, limit);

      const offset = (Number(page) - 1) * realLimit;

      const findOptions: FindManyOptions<Category> = {
        take: realLimit,
        skip: offset,
        order: {
          createdAt: 'DESC',
        },
      };

      const catsAndCount = await this.catRepository.findAndCount(findOptions);

      return {
        code: 200,
        success: true,
        message: 'Get Categories successfully',
        categories: catsAndCount[0],
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

  async getCategory(id: string): Promise<DataMutationResponse> {
    try {
      const category = await this.catRepository.findOneBy({ id });

      return {
        code: 200,
        success: true,
        message: `Get Category with id: ${id} successfully`,
        category: category,
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
    createCategoryInput: CreateCategoryInput,
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
      const category = this.catRepository.create({
        id: uuidv4(),
        ...createCategoryInput,
        slug: handleSlug(createCategoryInput.title),
      });

      const createdCategory = await this.catRepository.save(category);

      return {
        code: 200,
        success: true,
        message: 'Create Category successfully',
        category: createdCategory,
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
    { id, title, content }: UpdateCategoryInput,
    { req }: ContextType,
  ): Promise<DataMutationResponse> {
    try {
      if (!req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      const existingCat = await this.catRepository.findOneBy({ id });

      if (!existingCat) {
        return {
          code: 400,
          success: false,
          message: `Post not found`,
        };
      }

      if (title) {
        existingCat.title = title;
      }
      if (content) {
        existingCat.content = content;
      }
      await this.catRepository.save(existingCat);

      return {
        code: 200,
        success: true,
        message: 'Category updated successfully',
        category: existingCat,
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

      const existingCat = await this.catRepository.findOneBy({ id });
      if (!existingCat) {
        return {
          code: 400,
          success: false,
          message: `Category not found`,
        };
      }

      await this.catRepository.remove(existingCat);

      return {
        code: 200,
        success: true,
        message: 'Category deleted successfully',
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
