import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '../common/types';
import { CreateCategoryRequest } from './dto/createCategoryRequest.dto';
import { randomUUID } from 'node:crypto';
import { ArticleService } from '../article/article.service';

@Injectable()
export class CategoryService {
  private categories: Category[] = [];

  constructor(
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {}

  getCategories() {
    return this.categories;
  }

  getCategory(id: string) {
    const category = this.categories.find((category) => category.id === id);

    if (!category)
      throw new NotFoundException(`Category with id: ${id} was not found`);

    return category;
  }

  createCategory(dto: CreateCategoryRequest) {
    const newCategory = {
      id: randomUUID(),
      name: dto.name.trim(),
      description: dto.description.trim(),
    };
    this.categories.push(newCategory);

    return newCategory;
  }

  updateCategory(id: string, dto: CreateCategoryRequest) {
    const category = this.getCategory(id);

    Object.assign(category, dto);

    return category;
  }

  deleteCategory(id: string) {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id,
    );

    if (categoryIndex === -1)
      throw new NotFoundException(`Category with id: ${id} was not found`);

    this.categories.splice(categoryIndex, 1);
    this.articleService.setPropertyIdToNull(id, 'categoryId');
  }
}
