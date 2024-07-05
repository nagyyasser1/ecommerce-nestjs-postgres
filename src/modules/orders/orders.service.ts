import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto, ProductVariantDto } from './dto/create-order.dto';
import { Client } from '../clients/entities/client.entity';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private clientsService: ClientsService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    client: Client,
  ): Promise<Order> {
    if (client.isAdmin) {
      throw new BadRequestException('Admins cannot place orders.');
    }

    const existingClient = await this.clientsService.findOneById(client.id);

    if (!existingClient) {
      throw new NotFoundException('Client not found');
    }

    const { shippingDetails, paymentMethod, variants, notes } = createOrderDto;

    const products = await Promise.all(
      variants.map(async (variantDto: ProductVariantDto) => {
        const product = await this.productRepository.findOne({
          where: { id: variantDto.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${variantDto.productId} not found`,
          );
        }

        const productVariant = product.variants.find(
          (variant) =>
            variant.color === variantDto.variant.color &&
            variant.size === variantDto.variant.size,
        );

        if (!productVariant) {
          throw new NotFoundException(
            `Variant for product ID ${variantDto.productId} with color ${variantDto.variant.color} and size ${variantDto.variant.size} not found`,
          );
        }

        if (productVariant.quantity < variantDto.variant.quantity) {
          throw new BadRequestException(
            `Insufficient quantity for product ID ${variantDto.productId}, color ${variantDto.variant.color}, size ${variantDto.variant.size}`,
          );
        }

        // Deduct the quantity
        productVariant.quantity -= variantDto.variant.quantity;

        return product;
      }),
    );

    // Save updated products
    await this.productRepository.save(products);

    // Calculate total amount
    const totalAmount = products.reduce((sum, product, index) => {
      const variantDto = variants[index];
      return sum + product.price * variantDto.variant.quantity;
    }, 0);

    const order = this.orderRepository.create({
      client: existingClient,
      shippingDetails,
      paymentMethod,
      totalAmount,
      variants: variants.map((variantDto) => ({
        productId: variantDto.productId,
        productName: variantDto.productName,
        variant: variantDto.variant,
      })),
      notes,
      status: 'pending',
    });

    return await this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number, client: Client): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.client.id !== client.id && !client.isAdmin) {
      throw new BadRequestException(
        'You are not authorized to cancel this order',
      );
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already canceled');
    }

    const products = await Promise.all(
      order.variants.map(async (variant) => {
        const product = await this.productRepository.findOne({
          where: { id: variant.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${variant.productId} not found`,
          );
        }

        const productVariant = product.variants.find(
          (pv) =>
            pv.color === variant.variant.color &&
            pv.size === variant.variant.size,
        );

        if (!productVariant) {
          throw new NotFoundException(
            `Variant for product ID ${variant.productId} with color ${variant.variant.color} and size ${variant.variant.size} not found`,
          );
        }

        // Revert the quantity
        productVariant.quantity += variant.variant.quantity;

        return product;
      }),
    );

    // Save updated products
    await this.productRepository.save(products);

    // Update order status
    order.status = 'cancelled';

    return await this.orderRepository.save(order);
  }

  async updateOrderStatus(
    orderId: number,
    status: any,
    client: Client,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.client?.id !== client?.id && !client.isAdmin) {
      throw new BadRequestException(
        'You are not authorized to update this order',
      );
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    order.status = status;

    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }
}
