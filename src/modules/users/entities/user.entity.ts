import { Order } from 'src/modules/orders/entities/order.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

enum UserType {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Entity()
export class User {
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
    nullable: true,
  })
  phone: string;

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
    type: 'enum',
    enum: UserType,
    default: UserType.CLIENT,
  })
  userType: UserType;

  @Column({
    default: '',
  })
  verifyToken: string;

  @Column({
    default: 'default',
  })
  authType: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @OneToMany(() => Review, (review) => review.user, {
    cascade: true,
  })
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];
}
