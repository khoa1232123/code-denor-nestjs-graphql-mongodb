import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { handleSlug } from 'src/utils/func';
import { ContextType } from 'src/types/Context';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateProductInput,
  GetProductsInput,
  UpdateProductInput,
} from './product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  //   Dataloader Categories
  public async getCatsByBatch(
    catIds: readonly string[],
  ): Promise<Product | any> {
    const cats = await this.getAllCatsByIds(catIds);
    return cats;
  }

  public async getAllCatsByIds(catIds: readonly string[]): Promise<Product[]> {
    const findQuery: any = { $in: catIds };

    return await this.productRepository.find({ where: { id: findQuery } });
  }

  async getProducts({
    limit,
    page,
  }: GetProductsInput): Promise<DataMutationResponse> {
    try {
      console.log({ limit });

      const realLimit = Math.min(50, limit);

      const offset = (Number(page) - 1) * limit;

      const findOptions: FindManyOptions<Product> = {
        take: realLimit,
        skip: offset,
      };

      const productsAndCount =
        await this.productRepository.findAndCount(findOptions);

      return {
        code: 200,
        success: true,
        message: 'Get Products successfully',
        products: productsAndCount[0],
        count: productsAndCount[1],
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getProduct(id: string): Promise<DataMutationResponse> {
    try {
      const product = await this.productRepository.findOneBy({ id });

      return {
        code: 200,
        success: true,
        message: `Get Product with id: ${id} successfully`,
        product: product,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getProductBySlug(slug: string): Promise<DataMutationResponse> {
    try {
      const product = await this.productRepository.findOneBy({ slug });

      return {
        code: 200,
        success: true,
        message: `Get Product with slug: ${slug} successfully`,
        product: product,
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
    createProductInput: CreateProductInput,
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
      const slugTam = handleSlug(createProductInput.title);
      let slug = '';

      const existingProduct2 = await this.productRepository.findOneBy({
        slug: slugTam,
      });
      if (existingProduct2) {
        slug = slugTam + '-2';
      } else {
        slug = slugTam;
      }
      const product = this.productRepository.create({
        id: uuidv4(),
        ...createProductInput,
        slug: slug,
        userId: req.session.userId,
      });

      await this.productRepository.save(product);

      return {
        code: 200,
        success: true,
        message: 'Create Product successfully',
        product: product,
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
    {
      id,
      title,
      content,
      discount,
      image,
      price,
      published,
      quantity,
      variantOptions,
      variants,
    }: UpdateProductInput,
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

      const existingProduct = await this.productRepository.findOneBy({
        id,
      });

      if (!existingProduct) {
        return {
          code: 400,
          success: false,
          message: `Product not found`,
        };
      }

      if (title) {
        existingProduct.title = title;
        const slug = handleSlug(title);
        const existingProduct2 = await this.productRepository.findOneBy({
          slug,
        });
        if (existingProduct2) {
          existingProduct.slug = slug + '-2';
        } else {
          existingProduct.slug = slug;
        }
      }
      if (content) {
        existingProduct.content = content;
      }
      await this.productRepository.save(existingProduct);

      return {
        code: 200,
        success: true,
        message: 'Product updated successfully',
        product: existingProduct,
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

      const existingProduct = await this.productRepository.findOneBy({
        id,
      });
      if (!existingProduct) {
        return {
          code: 400,
          success: false,
          message: `Product not found`,
        };
      }

      await this.productRepository.remove(existingProduct);

      return {
        code: 200,
        success: true,
        message: 'Product deleted successfully',
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
