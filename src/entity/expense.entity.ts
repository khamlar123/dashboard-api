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
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.expense)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @ManyToOne(() => ExpenseCode, (expense_code) => expense_code.expense)
  @JoinColumn({ name: 'expense_code_id' })
  expense_code: ExpenseCode;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  scaled_amount: number;

  @Column()
  description: string;

  @Column({ type: 'date' }) // ✅ Ensure correct type
  date: Date;
}
