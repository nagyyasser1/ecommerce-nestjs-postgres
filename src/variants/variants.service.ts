import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {}

  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const newVariant = this.variantRepository.create({
      product: { id: createVariantDto.productId },
      color: { id: createVariantDto.colorId },
      size: { id: createVariantDto.sizeId },
      quantity: createVariantDto.quantity,
    });

    return await this.variantRepository.save(newVariant);
  }

  async findAll(): Promise<Variant[]> {
    return await this.variantRepository.find({
      relations: ['size', 'color', 'product'],
    });
  }

  async findOneById(id: number): Promise<Variant> {
    const variant = await this.variantRepository.findOneBy({ id });
    if (!variant) {
      throw new NotFoundException(`Variant: '${id}' not found!`);
    }
    return variant;
  }

  async findOneByOpt(
    productId: number,
    sizeId: number,
    colorId: number,
  ): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: {
        product: { id: productId },
        size: { id: sizeId },
        color: { id: colorId },
      },
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant: with 'sizeId:${sizeId}','colorId:${colorId}','productId:${productId}' not found!`,
      );
    }
    return variant;
  }

  async updateQuantity(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const variant = await this.findOneById(id);

    // Build the update query dynamically
    const updateQueryBuilder = this.variantRepository
      .createQueryBuilder()
      .update(variant);

    if (updateVariantDto.quantity !== undefined) {
      updateQueryBuilder.set({ quantity: updateVariantDto.quantity });
    }

    // Add the where clause and execute the update query
    updateQueryBuilder.where('id = :id', { id });
    await updateQueryBuilder.execute();

    // Fetch and return the updated variant
    return await this.variantRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.variantRepository.delete({ id });
  }
}
