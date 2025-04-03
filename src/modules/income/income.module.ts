import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { Income } from 'src/entity/income.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/entity/branch.entity';
import { IncomeCode } from 'src/entity/income_code.entity';
import { IncomePlan } from 'src/entity/income_plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, Branch, IncomeCode, IncomePlan])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
