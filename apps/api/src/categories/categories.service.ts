import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent category #${createCategoryDto.parentId} not found`);
      }
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findTrees();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['parent', 'children'] });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    
    Object.assign(category, updateCategoryDto);

    if (updateCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });
      if (!parent) {
        throw new NotFoundException(`Parent category #${updateCategoryDto.parentId} not found`);
      }
      category.parent = parent;
    } else if (updateCategoryDto.parentId === null) {
        category.parent = null;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
