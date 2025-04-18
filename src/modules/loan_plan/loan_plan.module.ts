import { Module } from '@nestjs/common';
import { LoanPlanService } from './loan_plan.service';
import { LoanPlanController } from './loan_plan.controller';
import { SharedModule } from '../../share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [LoanPlanController],
  providers: [LoanPlanService],
})
export class LoanPlanModule {}
