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
export class Liquidity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.liquidity)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column() // ✅ Ensure correct type
  date: string;

  @Column() // ✅ Ensure correct type
  type: string;

  @Column() // ✅ Ensure correct type
  ccy: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cddbal: number;

  @Column({ type: 'decimal', precision: 30, scale: 2, default: 0 }) // Adjusted decimal size
  cddlak: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  cdcbal: number;

  @Column({ type: 'decimal', precision: 30, scale: 2, default: 0 }) // Adjusted decimal size
  cdclak: number;

  @Column()
  typeid: string;
}
