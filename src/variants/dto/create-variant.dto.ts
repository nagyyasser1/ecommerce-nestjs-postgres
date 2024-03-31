import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateVariantDto {
  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsNumber()
  @IsNotEmpty()
  sizeId: number;

  @IsNumber()
  @IsNotEmpty()
  colorId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
