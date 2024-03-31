import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { CreateVariantDto } from 'src/variants/dto/create-variant.dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @ArrayMinSize(1)
  items: CreateVariantDto[];

  @IsObject()
  @IsNotEmptyObject()
  address: {
    street: string;
    town: string;
    city: string;
  };

  @IsObject()
  @IsNotEmptyObject()
  contact: {
    email: string;
    phone: number;
  };
}
