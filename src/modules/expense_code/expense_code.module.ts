import { Module } from '@nestjs/common';
import { ExpenseCodeService } from './expense_code.service';
import { ExpenseCodeController } from './expense_code.controller';
import { SharedModule } from 'src/share/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ExpenseCodeController],
  providers: [ExpenseCodeService],
})
export class ExpenseCodeModule {}
