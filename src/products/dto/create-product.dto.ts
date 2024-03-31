import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { CreateVariantDto } from 'src/variants/dto/create-variant.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  category: Category;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @ArrayMinSize(1)
  variants: CreateVariantDto[];
}
