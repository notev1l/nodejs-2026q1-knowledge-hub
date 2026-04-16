import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryRequest } from './dto/createCategoryRequest.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.prismaService.category.findMany()
  }

  async getCategory(id: string): Promise<Category> {
    const category =  this.prismaService.category.findUnique({
      where: { id }
    })

    if (!category)
      throw new NotFoundException(`Category with id: ${id} was not found`);

    return category;
  }

  async createCategory(dto: CreateCategoryRequest): Promise<Category> {
    return await this.prismaService.category.create({
      data: {
        name: dto.name.trim(),
        description: dto.description.trim(),
      }
    })
  }

  async updateCategory(id: string, dto: CreateCategoryRequest): Promise<Category> {

    return await this.prismaService.category.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        description: dto.description.trim(),
      }
    })
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategory(id)

    if (!category)
      throw new NotFoundException(`Category with id: ${id} was not found`);

    await this.prismaService.category.delete({
      where: { id }
    })
  }
}
