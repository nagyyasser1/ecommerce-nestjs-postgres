import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryService.findOneById(
      createProductDto.category,
    );

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.category} not found`,
      );
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category,
    });

    return await this.productRepository.save(product);
  }

  async findAll({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<Product[]> {
    const offset = (page - 1) * limit;
    return await this.productRepository.find({
      relations: ['category'],
      skip: offset,
      take: limit,
    });
  }
  async findOneById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.category) {
      const category = await this.categoryService.findOneById(
        updateProductDto.category,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.category} not found`,
        );
      }
      product.category = category;
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
