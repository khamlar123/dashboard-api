import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { ProfitService } from './profit.service';

@Controller('profit')
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}

  @Get('/dailly')
  async findDaily(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.findProfitDaily(date, branch);
  }

  @Get('/monthly')
  async findMonthly(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.findProfitMonthly(date, branch);
  }

  @Get('/yearly')
  async findYearly(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.findProfitYearly(date, branch);
  }

  @Get('/all-daily')
  async allDaily(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.profitAllBranchDaily(date);
  }

  @Get('/all-monthly')
  async allMonthly(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.profitAllBranchMonthly(date);
  }

  @Get('/all-yearly')
  async allYearly(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.profitService.profitAllBranchYearly(date);
  }
}
