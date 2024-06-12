import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category | undefined> {
    const existingCategory = await this.categoryRepo.findOneBy({
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
      return await this.categoryRepo.save(newCategory);
    } catch (error) {
      console.log('Error will creating new Category!.', error);
      return undefined;
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async findOneById(id: number): Promise<Category | null> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category: '${id}' not found!`);
    }

    return category;
  }

  async findOneByName(name: string): Promise<Category | null> {
    const category = await this.categoryRepo.findOneBy({ name });

    if (!category) {
      throw new NotFoundException(`Category: '${name}' not found!`);
    }
    return category;
  }

  async remove(id: number) {
    return await this.categoryRepo.delete({ id });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | undefined> {
    const existingCategory = await this.findOneById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category: '${id}' not found!`);
    }

    const updatedCategory = Object.assign(existingCategory, updateCategoryDto);

    try {
      return await this.categoryRepo.save(updatedCategory);
    } catch (error) {
      console.log('Error while updating Category!', error);
      return undefined;
    }
  }
}
