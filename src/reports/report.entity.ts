import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/models/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @CreateDateColumn()
  createdAt: Date;
}
