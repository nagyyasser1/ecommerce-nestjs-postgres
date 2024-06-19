import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  shipping_address: {
    street: string;
    town: string;
    city: string;
  };

  @Column({ type: 'json' })
  contact: {
    email: string;
    phone: number;
  };

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
