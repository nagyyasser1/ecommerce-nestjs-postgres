import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductsModule } from '../products/products.module';
import { ClientsService } from '../clients/clients.service';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule, ClientsModule],
  controllers: [OrdersController],
  providers: [OrderService, ClientsService],
})
export class OrdersModule {}
