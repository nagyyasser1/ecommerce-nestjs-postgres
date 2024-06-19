import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
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
