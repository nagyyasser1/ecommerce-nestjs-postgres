import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/modules/categories/entities/category.entity';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsNumber()
  categroy: Category;

  @IsNotEmpty()
  @IsString()
  name: string;
}
