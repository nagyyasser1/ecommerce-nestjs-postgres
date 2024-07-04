import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  private async updateProductVariants(
    productVariants: {
      productId: number;
      variant: { color: string; size: number; quantity: number };
    }[],
  ) {
    for (const item of productVariants) {
      const product = await this.productRepository.findOne({
        where: {
          id: item.productId,
        },
      });

      if (product && product.variants) {
        const variantIndex = product.variants.findIndex(
          (v) => v.color === item.variant.color && v.size === item.variant.size,
        );

        if (variantIndex !== -1) {
          product.variants[variantIndex].quantity -= item.variant.quantity;
          if (product.variants[variantIndex].quantity < 0) {
            product.variants[variantIndex].quantity = 0;
          }
        }

        await this.productRepository.save(product);
      }
    }
  }

  async updateOrderStatus(
    orderId: number,
    status: 'pending' | 'processing' | 'completed' | 'cancelled',
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'completed' && status === 'completed') {
      // Update product variants when the order is completed
      await this.updateProductVariants(order.variants);
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}
