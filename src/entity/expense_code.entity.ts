import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExpensePlan } from './expense_plan.entity';
import { Expense } from './expense.entity';

@Entity()
export class ExpenseCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @OneToMany(() => ExpensePlan, (expensePlan) => expensePlan.expense_code)
  expensePlans: ExpensePlan[];

  @OneToMany(() => Expense, (expensePlan) => expensePlan.expense_code)
  expense: Expense[];
}
