import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
