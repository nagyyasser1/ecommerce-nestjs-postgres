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
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './orders.service';
import { User as UserEntity } from '../users/entities/user.entity';
import { User } from 'src/common/decorators/user.decoratos';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
export class OrdersController {
  constructor(private readonly ordersService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @User() client: UserEntity) {
    return this.ordersService.createOrder(createOrderDto, client);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch('cancel/:id')
  cancelOrder(@Param('id') id: number, @User() client) {
    return this.ordersService.cancelOrder(id, client);
  }

  @Patch('status/:id')
  updateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @User() client: UserEntity,
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
