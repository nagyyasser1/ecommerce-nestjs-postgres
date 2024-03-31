import { Review } from 'src/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
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
  deviceToken: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @OneToMany(() => Review, (review) => review.client, {
    cascade: true,
  })
  reviews: Review[];
}
