import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UsersModule } from '../users/users.module';
import { SubCategory } from './entities/subCategory.entity';
import { SubCategoriesController } from './subCat.controller';
import { SubCategoriesService } from './subCat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory]), UsersModule],
  controllers: [CategoriesController, SubCategoriesController],
  providers: [CategoriesService, SubCategoriesService],
  exports: [CategoriesService, SubCategoriesService, TypeOrmModule],
})
export class CategoriesModule {}
