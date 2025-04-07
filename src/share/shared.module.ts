import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { Expense } from 'src/entity/expense.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { Income } from 'src/entity/income.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import { IncomePlan } from 'src/entity/income_plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Branch,
      Income,
      IncomeCode,
      IncomePlan,
      ExpensePlan,
      ExpenseCode,
      Expense,
    ]),
  ],
  exports: [
    TypeOrmModule, // This exports the TypeOrmModule with all registered entities
  ],
})
export class SharedModule {}
