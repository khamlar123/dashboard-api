import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { LoanPlan } from './loan_plan.entity';
import { ExpenseCode } from './expense_code.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.loan)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  // @ManyToOne(() => LoanPlan, (lp) => lp.loan_plan)
  // @JoinColumn({ name: 'loan_plan_id' })
  // loan_plan: LoanPlan;

  @Column() // ✅ Ensure correct type
  date: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  balance: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  npl_balance: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  app_amount: number;

  // @Column()
  // fund: number;

  // @Column({ type: 'decimal', precision: 30, scale: 2 })
  // drawndown: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  a: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  b: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  c: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  d: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  e: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  short: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  middle: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  longs: number;
}
