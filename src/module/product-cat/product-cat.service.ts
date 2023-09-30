import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextType } from 'src/types/Context';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { handleSlug } from 'src/utils/func';
import { FindManyOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductCat } from './product-cat.entity';
import {
  CreateProductCatInput,
  GetProductCatsInput,
  UpdateProductCatInput,
} from './product-cat.input';

@Injectable()
export class ProductCatService {
  constructor(
    @InjectRepository(ProductCat)
    private productCatRepository: Repository<ProductCat>,
  ) {}

  //   Dataloader Categories
  public async getCatsByBatch(
    catIds: readonly string[],
  ): Promise<ProductCat | any> {
    const cats = await this.getAllCatsByIds(catIds);
    return cats;
  }

  public async getAllCatsByIds(
    catIds: readonly string[],
  ): Promise<ProductCat[]> {
    const findQuery: any = { $in: catIds };

    return await this.productCatRepository.find({ where: { id: findQuery } });
  }

  async getProductCats({
    limit,
    page,
  }: GetProductCatsInput): Promise<DataMutationResponse> {
    try {
      console.log({ limit });

      const realLimit = Math.min(50, limit);

      const offset = (Number(page) - 1) * limit;

      const findOptions: FindManyOptions<ProductCat> = {
        take: realLimit,
        skip: offset,
      };

      const productCatsAndCount =
        await this.productCatRepository.findAndCount(findOptions);

      return {
        code: 200,
        success: true,
        message: 'Get Product Categories successfully',
        productCats: productCatsAndCount[0],
        count: productCatsAndCount[1],
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getProductCat(id: string): Promise<DataMutationResponse> {
    try {
      const productCat = await this.productCatRepository.findOneBy({ id });

      return {
        code: 200,
        success: true,
        message: `Get Product Category with id: ${id} successfully`,
        productCat: productCat,
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
    createCategoryInput: CreateProductCatInput,
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
      const slugTam = handleSlug(createCategoryInput.title);
      let slug = '';

      const existingProductCat2 = await this.productCatRepository.findOneBy({
        slug: slugTam,
      });
      if (existingProductCat2) {
        slug = slugTam + '-2';
      } else {
        slug = slugTam;
      }
      const productCat = this.productCatRepository.create({
        id: uuidv4(),
        ...createCategoryInput,
        slug: slug,
      });

      await this.productCatRepository.save(productCat);

      return {
        code: 200,
        success: true,
        message: 'Create Product Category successfully',
        productCat: productCat,
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
    { id, title, content }: UpdateProductCatInput,
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

      const existingProductCat = await this.productCatRepository.findOneBy({
        id,
      });

      if (!existingProductCat) {
        return {
          code: 400,
          success: false,
          message: `Product Category not found`,
        };
      }

      if (title) {
        existingProductCat.title = title;
        const slug = handleSlug(title);
        const existingProductCat2 = await this.productCatRepository.findOneBy({
          slug,
        });
        if (existingProductCat2) {
          existingProductCat.slug = slug + '-2';
        } else {
          existingProductCat.slug = slug;
        }
      }
      if (content) {
        existingProductCat.content = content;
      }
      await this.productCatRepository.save(existingProductCat);

      return {
        code: 200,
        success: true,
        message: 'Product Category updated successfully',
        productCat: existingProductCat,
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
      if (!req.session.userId) {
        return {
          code: 401,
          success: false,
          message: `Unauthorized`,
        };
      }

      const existingProductCat = await this.productCatRepository.findOneBy({
        id,
      });
      if (!existingProductCat) {
        return {
          code: 400,
          success: false,
          message: `Product Category not found`,
        };
      }

      await this.productCatRepository.remove(existingProductCat);

      return {
        code: 200,
        success: true,
        message: 'Product Category deleted successfully',
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
