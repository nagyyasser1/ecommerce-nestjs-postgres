import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subCategory.entity';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { CategoriesService } from './categories.service';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
    private readonly categoryService: CategoriesService,
  ) {}

  // Create a new subcategory
  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const category = await this.categoryService.findCategoryById(
      createSubCategoryDto.categoryId,
    );

    if (!category) {
      throw new NotFoundException(`Category id: ${category.id} not found`);
    }
    const newSubCategory = new SubCategory();

    newSubCategory.category = category;
    newSubCategory.name = createSubCategoryDto.name;

    return this.subCategoryRepository.save(newSubCategory);
  }

  // Get a subcategory by ID
  async findOne(id: number): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }
    return subCategory;
  }

  // Update a subcategory by ID
  async update(
    id: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.preload({
      id: id,
      ...updateSubCategoryDto,
    });
    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }
    return await this.subCategoryRepository.save(subCategory);
  }

  // Remove a subcategory by ID
  async remove(id: number): Promise<void> {
    const subCategory = await this.findOne(id);
    await this.subCategoryRepository.remove(subCategory);
  }
}
