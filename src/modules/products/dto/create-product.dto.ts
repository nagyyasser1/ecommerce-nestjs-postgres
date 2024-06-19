import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  short_description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  old_price?: number;

  @IsString()
  @IsNotEmpty()
  page_title: string;

  @IsString()
  @IsNotEmpty()
  meta_description: string;

  @IsBoolean()
  @IsNotEmpty()
  visible: boolean;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  tags: string[];

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  category: number;

  @IsOptional()
  @IsArray()
  @Type(() => VariantDto)
  variants?: VariantDto[];
}

class VariantDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
