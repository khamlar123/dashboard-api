import { Module } from '@nestjs/common';
import { ExpensePlanService } from './expense_plan.service';
import { ExpensePlanController } from './expense_plan.controller';
import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ExpensePlanController],
  providers: [ExpensePlanService],
})
export class ExpensePlanModule {}
