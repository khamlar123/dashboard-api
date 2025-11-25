import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { Expense } from 'src/entity/expense.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { Income } from 'src/entity/income.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import { IncomePlan } from 'src/entity/income_plan.entity';
import { LoanPlan } from '../entity/loan_plan.entity';
import { Loan } from '../entity/loan.entity';
import { SectorBal } from '../entity/sector_bal.entity';
import { Sector } from '../entity/sector.entity';
import { Deposit } from '../entity/deposit.entity';
import { Employee } from '../entity/employee.entity';
import { EmployeeNew } from '../entity/employee_new.entity';
import { EmployeeLeft } from '../entity/employee_left.entity';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';

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
      LoanPlan,
      Loan,
      SectorBal,
      Sector,
      Deposit,
      Employee,
      EmployeeNew,
      EmployeeLeft,
      Role,
      Permission,
    ]),
  ],
  exports: [
    TypeOrmModule, // This exports the TypeOrmModule with all registered entities
  ],
})
export class SharedModule {}
