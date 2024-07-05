import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { OrderService } from './orders.service';
import { Client } from '../clients/decorators/client.decorator';
import { Client as ClientEntity } from '../clients/entities/client.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Client() client: ClientEntity,
  ) {
    return this.ordersService.createOrder(createOrderDto, client);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch('cancel/:id')
  cancelOrder(@Param('id') id: number, @Client() client) {
    return this.ordersService.cancelOrder(id, client);
  }

  @Patch('status/:id')
  updateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @Client() client,
  ) {
    return this.ordersService.updateOrderStatus(id, status, client);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
