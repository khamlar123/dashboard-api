import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ExpensePlan } from './expense_plan.entity';
import { Expense } from './expense.entity';
import { IncomePlan } from './income_plan.entity';
import { Income } from './income.entity';
import { LoanPlan } from './loan_plan.entity';
import { Loan } from './loan.entity';
import { ProfitPlan } from './profit_plan.entity';
import { SectorPlan } from './sector_plan.entity';
import { SectorBal } from './sector_bal.entity';
import { Deposit } from './deposit.entity';
import { Capital } from './capital.entity';
import { BolLoan } from './bol_loan.entity';
import { AdminBal } from './admin_bal.entity';
import { Liquidity } from './liquidity.entity';
import { Employee } from './employee.entity';
import { User } from './user.entity';

@Entity()
export class Branch {
  @PrimaryColumn() // Changed from @PrimaryGeneratedColumn()
  code: number; // This will be your manually assigned primary key

  @Column()
  name: string;

  @OneToMany(() => ExpensePlan, (expensePlan) => expensePlan.branch)
  expensePlans: ExpensePlan[];

  @OneToMany(() => Expense, (expensePlan) => expensePlan.branch)
  expense: Expense[];

  @OneToMany(() => IncomePlan, (incomePlan) => incomePlan.branch)
  incomePlans: IncomePlan[];

  @OneToMany(() => Income, (income) => income.branch)
  income: Income[];

  @OneToMany(() => ProfitPlan, (pl) => pl.branch)
  profitPlan: ProfitPlan[];

  @OneToMany(() => LoanPlan, (loanPlan) => loanPlan.branch)
  loanPlan: LoanPlan[];

  @OneToMany(() => Loan, (loan) => loan.branch)
  loan: Loan[];

  @OneToMany(() => SectorPlan, (sp) => sp.branch)
  sectorPlan: SectorPlan[];

  @OneToMany(() => SectorBal, (sp) => sp.branch)
  sectorBal: SectorBal[];

  @OneToMany(() => Deposit, (d) => d.branch)
  deposit: Deposit[];

  @OneToMany(() => Capital, (c) => c.branch)
  capital: Capital[];

  @OneToMany(() => BolLoan, (b) => b.branch)
  bolLoan: Capital[];

  @OneToMany(() => AdminBal, (b) => b.branch)
  adminBal: AdminBal[];

  @OneToMany(() => Liquidity, (l) => l.branch)
  liquidity: Liquidity[];

  @OneToMany(() => Employee, (e) => e.branch)
  employee: Employee[];

  @OneToMany(() => User, (e) => e.branch)
  users: User[];
}
