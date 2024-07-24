import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Category } from './entities/category.entity';
import { CreateSubcategoryDto } from './dto/create-subCategory.dto';
import { SubCategory } from './entities/subCategory.entity';

@ApiTags('category')
@Controller('category')
@UseGuards(AdminGuard)
@UsePipes(ValidationPipe)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Post('subCategory')
  createSubCategory(
    @Body() createSubCategoryDto: CreateSubcategoryDto,
  ): Promise<SubCategory> {
    return this.categoriesService.createSubCategory(createSubCategoryDto);
  }

  @Get()
  findCategoriesWithItsSubCategories(): Promise<Category[]> {
    return this.categoriesService.findCategoriesWithItsSubCategories();
  }

  @Get(':id')
  findCategoryWithItsSubCategories(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findCategoryWithItsSubCategories(+id);
  }

  @Get(':id')
  findAllProductsByCategory(
    @Param('id') categroyId: number,
  ): Promise<Category[]> {
    return this.categoriesService.findProductsByCategory(categroyId);
  }

  @Get(':catId/:subId')
  async findAllProductsByCategoryAndSubCategory(
    @Param('catId') catId: number,
    @Param('subId') subId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.categoriesService.findProductsByCategoryAndSubCategory(
      catId,
      subId,
      page,
      limit,
    );
  }
}
