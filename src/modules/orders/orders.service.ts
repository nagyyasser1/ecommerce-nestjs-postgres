import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource,
  ) {}

  // async create(createOrderDto: CreateOrderDto): Promise<Order | null> {
  //   const queryRunner = this.dataSource.createQueryRunner();

  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     const newOrder = new Order();
  //     newOrder.shipping_address = createOrderDto.address;
  //     newOrder.contact = createOrderDto.contact;

  //     const processedVariants = [];

  // for (const {
  //   productId,
  //   sizeId,
  //   colorId,
  //   quantity,
  // } of createOrderDto.items) {
  // Fetch and update variant within the transaction
  // const existingVariant = await queryRunner.manager.findOne(Variant, {
  //   where: {
  //     product: { id: productId },
  //     size: { id: sizeId },
  //     color: { id: colorId },
  //   },
  //   relations: ['product'],
  // });
  // Validate variant existence and quantity
  // if (!existingVariant) {
  //   throw new BadRequestException('Invalid variant');
  // }
  // if (existingVariant.quantity < quantity) {
  //   throw new BadRequestException('Insufficient quantity');
  // }
  // processedVariants.push({
  //   variant: existingVariant,
  //   quantity,
  // });
  // Update quantity immediately within the transaction
  // await queryRunner.manager.update(Variant, existingVariant.id, {
  //   quantity: existingVariant.quantity - quantity,
  // });
  // }

  // Create Order instance within the transaction
  // const savedOrder = await queryRunner.manager.save(Order, newOrder);

  // Create OrderItems in a batch (if supported by repository)
  // const orderItems = processedVariants.map((item) =>
  //   this.orderItemRepository.create({
  //     quantity: item.quantity,
  //     variant: { id: item.variant.id },
  //     order: { id: savedOrder.id },
  //   }),
  // );
  // await queryRunner.manager.save(OrderItem, orderItems);

  //   await queryRunner.commitTransaction();
  //   return savedOrder;
  // } catch (error) {
  //   await queryRunner.rollbackTransaction();
  //   throw new UnprocessableEntityException(error.message);
  // } finally {
  //   await queryRunner.release();
  // }
  // }

  // async findAll(): Promise<Order[]> {
  //   return await this.orderRepository.find({
  //     relations: [
  //       'orderItems'
  //     ],
  //   });
  // }
}
