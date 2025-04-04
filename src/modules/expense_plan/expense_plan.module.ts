import { Module } from '@nestjs/common';
import { ExpensePlanService } from './expense_plan.service';
import { ExpensePlanController } from './expense_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensePlan } from 'src/entity/expense_plan.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';
import { Branch } from 'src/entity/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensePlan, ExpenseCode, Branch])],
  controllers: [ExpensePlanController],
  providers: [ExpensePlanService],
})
export class ExpensePlanModule {}
