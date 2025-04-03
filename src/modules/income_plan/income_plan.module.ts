import { Module } from '@nestjs/common';
import { IncomePlanService } from './income_plan.service';
import { IncomePlanController } from './income_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomePlan } from 'src/entity/income_plan.entity';
import { Branch } from 'src/entity/branch.entity';
import { IncomeCode } from 'src/entity/income_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomePlan, Branch, IncomeCode])],
  controllers: [IncomePlanController],
  providers: [IncomePlanService],
})
export class IncomePlanModule {}
