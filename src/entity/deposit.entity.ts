import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // ✅ Ensure correct type
  date: string;

  @ManyToOne(() => Branch, (branch) => branch.deposit)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  ccy: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cddbal: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cddballak: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cdcbal: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cdcballak: number;
}
