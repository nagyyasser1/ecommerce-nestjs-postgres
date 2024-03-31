import { Variant } from 'src/variants/entities/variant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Variant, (variant) => variant.orderItems)
  variant: Variant;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
