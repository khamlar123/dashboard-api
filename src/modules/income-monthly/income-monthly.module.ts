import { Module } from '@nestjs/common';
import { IncomeMonthlyService } from './income-monthly.service';
import { IncomeMonthlyController } from './income-monthly.controller';
import { IncomeMonthly } from 'src/entity/income-monthly.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeMonthly])],
  controllers: [IncomeMonthlyController],
  providers: [IncomeMonthlyService],
})
export class IncomeMonthlyModule {}
