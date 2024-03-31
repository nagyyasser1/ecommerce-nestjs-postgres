import { Variant } from 'src/variants/entities/variant.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => Variant, (variant) => variant.size)
  variant: Variant[];
}
