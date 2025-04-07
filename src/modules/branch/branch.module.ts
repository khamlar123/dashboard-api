import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { IncomePlan } from 'src/entity/income_plan.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Branch,
      IncomePlan,
      IncomeCode,
      ExpensePlan,
      ExpenseCode,
    ]),
  ],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
