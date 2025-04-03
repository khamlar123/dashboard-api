import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExpensePlan } from './expense_plan.entity';
import { Expense } from './expense.entity';
import { IncomePlan } from './income_plan.entity';
import { Income } from './income.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

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
}
