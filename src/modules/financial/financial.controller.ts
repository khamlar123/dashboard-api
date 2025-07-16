import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { FinancialService } from './financial.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('financial')
@ApiBearerAuth()
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get('/funding')
  async useFunding(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.financialService.useFunding(date, branch, option);
  }

  @Get('/profit')
  async profit(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.financialService.profit(date, branch, option);
  }

  @Get('/npl')
  async npl(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.financialService.npl(date, branch, option);
  }

  @Get('/loan-bol')
  async loanBol(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.financialService.loanBol(date, branch, option);
  }

  @Get('/funds')
  @ApiQuery({ name: 'branch', required: false })
  async funds(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.financialService.funding(date, branch, option);
  }

  @Get('/deposit')
  @ApiQuery({ name: 'branch', required: false })
  async deposit(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'd' | 'm' | 'y',
  ) {
    return await this.financialService.deposit(date, branch, option);
  }

  @Get('/compare-income')
  async compareIncome(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
  ) {
    return await this.financialService.compareIncome(date, branch, option);
  }

  @Get('/compare-expense')
  async compareExpense(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
  ) {
    return await this.financialService.compareExpense(date, branch, option);
  }

  @Get('/compare-profit')
  async compareProfit(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
  ) {
    return await this.financialService.compareProfit(date, branch, option);
  }

  @Get('/income-compare-income')
  async incomeCompareIncome(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
  ) {
    return await this.financialService.incomeCompareIncome(
      date,
      branch,
      option,
    );
  }

  @Get('/expense-compare-expense')
  async expenseCompareExpense(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
  ) {
    return await this.financialService.expenseCompareExpense(
      date,
      branch,
      option,
    );
  }

  @Get('/profit-compare-profit')
  async profitCompareProfit(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
    @Query('option', new DefaultValuePipe(''))
    option: 'm' | 'y',
  ) {
    return await this.financialService.profitCompareProfit(
      date,
      branch,
      option,
    );
  }
}
