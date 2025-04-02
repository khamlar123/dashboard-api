import { Module } from '@nestjs/common';
import { ExpenseMonthlyService } from './expense-monthly.service';
import { ExpenseMonthlyController } from './expense-monthly.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseMonthly } from 'src/entity/expense-monthly.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseMonthly])],
  controllers: [ExpenseMonthlyController],
  providers: [ExpenseMonthlyService],
})
export class ExpenseMonthlyModule {}
