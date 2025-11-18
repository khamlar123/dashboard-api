import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/all-assets')
  async allAssets(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.allAssets(date);
  }

  @Get('/all-liability')
  async allLiability(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.allLiability(date);
  }

  @Get('/all-capital')
  async allCapital(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.allCapital(date);
  }

  @Get('/profit-loss')
  async profitLoss(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.profit(date);
  }

  @Get('/income')
  async income(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.income(date);
  }

  @Get('/expense')
  async expense(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.expense(date);
  }

  @Get('/funds')
  async funds(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.funds(date);
  }
}
