import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { ExpenseCode } from './expense_code.entity';

@Entity()
export class ExpensePlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExpenseCode, (expense_code) => expense_code.expensePlans)
  @JoinColumn({ name: 'expense_code_id' })
  expense_code: ExpenseCode;

  @ManyToOne(() => Branch, (branch) => branch.expensePlans)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  date: Date;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;
}
