import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './branch.entity';
import { Loan } from './loan.entity';
import { ExpensePlan } from './expense_plan.entity';

@Entity()
export class LoanPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Branch, (branch) => branch.loanPlan)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column() // ✅ Ensure correct type
  year: string;

  @Column({ type: 'decimal', precision: 30, scale: 2 }) // Adjusted decimal size
  amount: number;

  @Column({ type: 'decimal', precision: 30, scale: 2 })
  npl_plan: number;

  // @OneToMany(() => Loan, (loan) => loan.loan_plan)
  // loan_plan: Loan[];
}
