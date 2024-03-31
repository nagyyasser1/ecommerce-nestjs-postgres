import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
