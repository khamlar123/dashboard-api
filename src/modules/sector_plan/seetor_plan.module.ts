import { Module } from '@nestjs/common';
import { SeetorPlanService } from './seetor_plan.service';
import { SeetorPlanController } from './seetor_plan.controller';

@Module({
  controllers: [SeetorPlanController],
  providers: [SeetorPlanService],
})
export class SeetorPlanModule {}
