import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatabaseService } from '../../common/database/database.service';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('')
  async findExpense(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.expenseService.findExpense(date, branch, option);
  }

  @Get('/dailly')
  async findExpenseDailly(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.expenseService.findExpenseDaily(date, branch, option);
  }
}
