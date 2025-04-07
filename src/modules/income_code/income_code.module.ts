import { Module } from '@nestjs/common';
import { IncomeCodeService } from './income_code.service';
import { IncomeCodeController } from './income_code.controller';
import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [IncomeCodeController],
  providers: [IncomeCodeService],
})
export class IncomeCodeModule {}
