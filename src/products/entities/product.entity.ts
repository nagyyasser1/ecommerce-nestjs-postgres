import { Category } from 'src/categories/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Variant } from 'src/variants/entities/variant.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column()
  active: boolean;

  @Column('text', { array: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Variant, (variant) => variant.product)
  variant: Variant[];

  @OneToMany(() => Review, (review) => review.client, {
    cascade: true,
  })
  reviews: Review[];
}
