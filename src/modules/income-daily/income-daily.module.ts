import { Module } from '@nestjs/common';
import { IncomeDailyController } from './income-daily.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeDaily } from 'src/entity/income-daily.entity';
import { IncomeDailyService } from './income-daily.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeDaily])],
  controllers: [IncomeDailyController],
  providers: [IncomeDailyService],
})
export class IncomeDailyModule {}
