import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { SharedModule } from 'src/share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [IncomeController],
  providers: [IncomeService, DatabaseService],
})
export class IncomeModule {}
