import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { SharedModule } from 'src/share/shared.module';
import { DatabaseService } from '../../common/database/database.service';

@Module({
  imports: [SharedModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, DatabaseService],
})
export class ExpenseModule {}
