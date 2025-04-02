import { Module } from '@nestjs/common';
import { ExpenseDailyService } from './expense-daily.service';
import { ExpenseDailyController } from './expense-daily.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseDaily } from 'src/entity/expense-daily.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseDaily])],
  controllers: [ExpenseDailyController],
  providers: [ExpenseDailyService],
})
export class ExpenseDailyModule {}
