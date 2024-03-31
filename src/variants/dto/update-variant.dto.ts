import { PartialType } from '@nestjs/swagger';
import { CreateVariantDto } from './create-variant.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}
