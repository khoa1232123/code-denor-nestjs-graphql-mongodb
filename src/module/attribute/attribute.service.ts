import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Attribute } from './attribute.entity';
import {
  CreateAttributeInput,
  GetAttributesInput,
  UpdateAttributeInput,
} from './attribute.input';
import { DataMutationResponse } from 'src/types/DataMutationResponse';
import { ContextType } from 'src/types/Context';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
  ) {}

  //   Dataloader Attributes
  public async getAttributesByBatch(
    attrIds: readonly string[],
  ): Promise<Attribute | any> {
    const attrs = await this.getAllAttributesByIds(attrIds);
    return attrs;
  }

  public async getAllAttributesByIds(
    attrIds: readonly string[],
  ): Promise<Attribute[]> {
    const findQuery: any = { $in: attrIds };

    return await this.attributeRepository.find({ where: { id: findQuery } });
  }

  async getAttributes({
    limit = 10,
    page = 1,
  }: GetAttributesInput): Promise<DataMutationResponse> {
    try {
      const realLimit = limit;
      console.log({ realLimit });

      const offset = (Number(page) - 1) * limit;

      const findOptions: FindManyOptions<Attribute> = {
        take: realLimit,
        skip: offset,
        order: {
          createdAt: 'DESC',
        },
      };

      const attrsAndCount =
        await this.attributeRepository.findAndCount(findOptions);

      const pageTotal = Math.ceil(attrsAndCount[1] / realLimit);

      return {
        code: 200,
        success: true,
        message: 'Get Attributes successfully',
        attributes: attrsAndCount[0],
        count: attrsAndCount[1],
        metaInfo: {
          pageCurrent: page,
          count: attrsAndCount[1],
          pageTotal: pageTotal,
        },
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      };
    }
  }

  async getAttribute(id: string): Promise<DataMutationResponse> {
    try {
      const attribute = await this.attributeRepository.findOneBy({ id });

      return {
        code: 200,
        success: true,
        message: `Get Attribute with id: ${id} successfully`,
        attribute: attribute,
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
    createCategoryInput: CreateAttributeInput,
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
      const attribute = this.attributeRepository.create({
        id: uuidv4(),
        ...createCategoryInput,
      });

      await this.attributeRepository.save(attribute);

      return {
        code: 200,
        success: true,
        message: 'Create Attribute successfully',
        attribute: attribute,
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
    { id, title, content, values }: UpdateAttributeInput,
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

      const existingAttribute = await this.attributeRepository.findOneBy({
        id,
      });

      if (!existingAttribute) {
        return {
          code: 400,
          success: false,
          message: `Attribute not found`,
        };
      }

      if (title) {
        existingAttribute.title = title;
      }
      if (content) {
        existingAttribute.content = content;
      }
      if (values) {
        existingAttribute.values = values;
      }
      await this.attributeRepository.save(existingAttribute);

      return {
        code: 200,
        success: true,
        message: 'Attribute updated successfully',
        attribute: existingAttribute,
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

      const existingProductCat = await this.attributeRepository.findOneBy({
        id,
      });
      if (!existingProductCat) {
        return {
          code: 400,
          success: false,
          message: `Attribute not found`,
        };
      }

      await this.attributeRepository.remove(existingProductCat);

      return {
        code: 200,
        success: true,
        message: 'Attribute deleted successfully',
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
