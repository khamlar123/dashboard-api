import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { IncomeCode } from './income_code.entity';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.income)
  @JoinColumn()
  branch: Branch;

  @ManyToOne(() => IncomeCode, (income_code) => income_code.income)
  @JoinColumn()
  income_code: IncomeCode;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  scaled_amount: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  date: Date;
}
