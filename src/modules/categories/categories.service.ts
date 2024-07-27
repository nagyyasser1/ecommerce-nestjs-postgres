import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subCategory.entity';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category | undefined> {
    const existingCategory = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category: "${createCategoryDto.name}", aready exists!`,
      );
    }

    const newCategory = new Category();
    newCategory.name = createCategoryDto.name;
    newCategory.slug = createCategoryDto.slug;
    newCategory.description = createCategoryDto.description;
    newCategory.metaDescription = createCategoryDto.metaDescription;
    newCategory.pageTitle = createCategoryDto.pageTitle;
    newCategory.picUrl = createCategoryDto.picUrl;

    try {
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      console.log('Error will creating new Category!.', error);
      return undefined;
    }
  }

  async createSubCategory(
    createSubcategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const category = await this.categoryRepository.findOneBy({
      id: createSubcategoryDto.categoryId,
    });

    if (!category) {
      throw new NotFoundException(`Category id: ${category.id} not found`);
    }
    const newSubCategory = new SubCategory();

    newSubCategory.category = category;
    newSubCategory.name = createSubcategoryDto.name;

    return this.subCategoryRepository.save(newSubCategory);
  }

  async findCategoriesWithItsSubCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['subCategories'],
    });
  }

  async findCategoryWithItsSubCategories(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({
      where: {
        id: id,
      },
      relations: ['subCategories'],
    });
  }

  async findProductsByCategory(categoryId: number): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: {
        id: categoryId,
      },
      relations: ['products'],
      select: {
        name: true,
        products: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findProductsByCategoryAndSubCategory(
    categoryId: number,
    subCategoryId: number,
    page: number,
    pageSize: number,
  ) {
    const [products, total] = await this.subCategoryRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.products', 'product')
      .where('subCategory.id = :subCategoryId', { subCategoryId })
      .andWhere('subCategory.category.id = :categoryId', { categoryId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findCategoryById(id: number): Promise<Category> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async findSubCategoryById(id: number): Promise<SubCategory> {
    return await this.subCategoryRepository.findOneBy({ id });
  }

  async updateCategory(id: number, updateCategory: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`category with id: ${id} not found!.`);
    }

    Object.assign(category, updateCategory);
    return await this.categoryRepository.save(category);
  }

  async removeSubCategory(id: number) {
    const category = this.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`category with id: ${id} not found!.`);
    }
    await this.categoryRepository.delete({
      id,
    });
  }
}
