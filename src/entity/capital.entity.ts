import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';

@Entity()
export class Capital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  dep_plan: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  loan_plan: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  funding_plan: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  use_funding_plan: number;

  @Column({ type: 'varchar', length: 10 })
  year: string;

  @ManyToOne(() => Branch, (branch) => branch.capital)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
