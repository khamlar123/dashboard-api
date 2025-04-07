import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
