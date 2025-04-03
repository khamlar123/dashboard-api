import { Module } from '@nestjs/common';
import { ExpenseCodeService } from './expense_code.service';
import { ExpenseCodeController } from './expense_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseCode } from 'src/entity/expense_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseCode])],
  controllers: [ExpenseCodeController],
  providers: [ExpenseCodeService],
})
export class ExpenseCodeModule {}
