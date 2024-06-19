import { Client } from 'src/modules/clients/entities/client.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Client, (client) => client.reviews)
  client: Client;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Client;
}
