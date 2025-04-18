import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { SharedModule } from '../../share/shared.module';
import { DatabaseService } from '../../database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [LoanController],
  providers: [LoanService, DatabaseService],
})
export class LoanModule {}
