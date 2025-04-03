import { Module } from '@nestjs/common';
import { ExpensePlanService } from './expense_plan.service';
import { ExpensePlanController } from './expense_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensePlan } from 'src/entity/expense_plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpensePlan])],
  controllers: [ExpensePlanController],
  providers: [ExpensePlanService],
})
export class ExpensePlanModule {}
