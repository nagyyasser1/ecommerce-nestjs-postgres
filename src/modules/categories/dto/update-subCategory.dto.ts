import { PartialType } from '@nestjs/swagger';
import { CreateSubcategoryDto } from './create-subCategory.dto';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}
