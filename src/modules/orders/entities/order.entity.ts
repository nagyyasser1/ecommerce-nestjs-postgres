import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  shippingDetails: {
    email: string;
    phone: number;
    city: string;
    address: string;
  };

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

  @Column({
    type: 'enum',
    enum: ['cash', 'card', 'stripe'],
    default: 'cash',
  })
  paymentMethod: 'cash' | 'card' | 'stripe';

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'jsonb', nullable: true })
  variants: {
    productId: number;
    productName: string;
    variant: { color: string; size: number; quantity: number };
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
