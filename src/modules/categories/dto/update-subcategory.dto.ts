import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-subcategory.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
