import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { VariantsService } from 'src/variants/variants.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly variantsService: VariantsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, images, price, category, active } =
      createProductDto;

    const newProduct = new Product();

    newProduct.name = name;
    newProduct.description = description;
    newProduct.images = images;
    newProduct.active = active;
    newProduct.price = price;
    newProduct.category = category;

    const savedProduct = await this.productRepository.save(newProduct);

    for (const variant of createProductDto.variants) {
      variant.productId = savedProduct.id;
      await this.variantsService.create(variant);
    }

    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOneById(id: number): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .leftJoinAndSelect('product.variant', 'variants')
      .leftJoinAndSelect('variants.size', 'size')
      .leftJoinAndSelect('variants.color', 'color')
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product: '${id}' not found!`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOneById(id);

    // Build the update query dynamically
    const updateQueryBuilder = this.productRepository
      .createQueryBuilder()
      .update(product);

    if (updateProductDto.name !== undefined) {
      updateQueryBuilder.set({ name: updateProductDto.name });
    }

    if (updateProductDto.description !== undefined) {
      updateQueryBuilder.set({ description: updateProductDto.description });
    }

    if (updateProductDto.price !== undefined) {
      updateQueryBuilder.set({ price: updateProductDto.price });
    }

    if (updateProductDto.active !== undefined) {
      updateQueryBuilder.set({ active: updateProductDto.active });
    }

    if (updateProductDto.images !== undefined) {
      updateQueryBuilder.set({ images: updateProductDto.images });
    }

    // Add the where clause and execute the update query
    updateQueryBuilder.where('id = :id', { id });
    await updateQueryBuilder.execute();

    // Fetch and return the updated variant
    return await this.productRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.productRepository.delete({ id });
  }
}
