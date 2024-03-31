import { Color } from 'src/color/entities/color.entity';
import { OrderItem } from 'src/orders/entities/orderItem.entity';
import { Product } from 'src/products/entities/product.entity';
import { Size } from 'src/sizes/entities/size.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variant)
  product: Product;

  @ManyToOne(() => Size, (size) => size.variant)
  size: Size;

  @ManyToOne(() => Color, (color) => color.variant)
  color: Color;

  @Column()
  quantity: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  orderItems: OrderItem[];
}
