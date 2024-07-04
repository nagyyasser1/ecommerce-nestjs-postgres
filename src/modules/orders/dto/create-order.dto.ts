import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

class ProductVariantDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VariantDto)
  variant: VariantDto;
}

class ShippingDetailsDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsEnum(['pending', 'processing', 'shipped', 'completed', 'cancelled'])
  status?: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShippingDetailsDto)
  shippingDetails?: ShippingDetailsDto;

  @IsNotEmpty()
  @IsEnum(['cash', 'card', 'stripe'])
  paymentMethod: 'cash' | 'card' | 'stripe';

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
