import { Module } from '@nestjs/common';
import { IncomeCodeService } from './income_code.service';
import { IncomeCodeController } from './income_code.controller';
import { IncomeCode } from 'src/entity/income_code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeCode])],
  controllers: [IncomeCodeController],
  providers: [IncomeCodeService],
})
export class IncomeCodeModule {}
