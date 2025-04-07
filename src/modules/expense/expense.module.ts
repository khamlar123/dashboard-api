import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/entity/expense.entity';
import { Branch } from 'src/entity/branch.entity';
import { ExpenseCode } from 'src/entity/expense_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Branch, ExpenseCode])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
