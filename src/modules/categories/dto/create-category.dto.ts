import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
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
  pageTitle: string;

  @IsString()
  @IsNotEmpty()
  metaDescription: string;

  @IsString()
  @IsNotEmpty()
  picUrl: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;
}
