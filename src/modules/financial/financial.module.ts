import { Module } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialController } from './financial.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [FinancialController],
  providers: [FinancialService, DatabaseService],
})
export class FinancialModule {}
