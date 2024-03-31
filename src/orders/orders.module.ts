import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { VariantsModule } from 'src/variants/variants.module';
import { OrderItem } from './entities/orderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), VariantsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
