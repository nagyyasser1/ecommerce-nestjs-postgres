import { Category } from 'src/modules/categories/entities/category.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
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

  @Column()
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  short_description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'decimal', nullable: true })
  old_price?: number;

  @Column()
  page_title: string;

  @Column()
  meta_description: string;

  @Column()
  visible: boolean;

  @Column('text', { array: true })
  tags: string[];

  @Column('text', { array: true })
  images: string[];

  @Column('json', { nullable: true })
  variants?: { color: string; size: number; quantity: number }[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Review, (review) => review.client, {
    cascade: true,
  })
  reviews: Review[];
}
