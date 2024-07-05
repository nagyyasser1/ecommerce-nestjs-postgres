import { Order } from 'src/modules/orders/entities/order.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  fname: string;

  @Column({
    nullable: false,
  })
  lname: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    default: '',
  })
  verifyToken: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @OneToMany(() => Review, (review) => review.client, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.client, {
    cascade: true,
  })
  orders: Order[];
}
