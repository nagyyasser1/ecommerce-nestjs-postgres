import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  slug: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  pageTitle: string;

  @Column({
    nullable: false,
  })
  metaDescription: string;

  @Column({
    nullable: false,
  })
  picUrl: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
