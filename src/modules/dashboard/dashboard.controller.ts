import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('dashboard')
@ApiBearerAuth()
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

  @Get('/use-fund')
  async useFunds(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.useFunds(date);
  }

  @Get('/loan-sector')
  async loanSector(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.loanSector(date);
  }

  @Get('/pl-npl')
  async plNpl(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.plNpl(date);
  }

  @Get('/financial-ratios')
  async financialRatios(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.financialRatios(date);
  }

  @Get('/sum-period')
  async sumPeriod(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.sumPeriod(date, 'all', 'd');
  }

  @Get('/dp-product')
  async dpProduct(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.dashboardService.dpProduct(date);
  }

  @Get('exchange')
  async GetExchange(
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ): Promise<any> {
    return await this.dashboardService.getExchange(date);
  }
}
