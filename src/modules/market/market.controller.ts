import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { MarketService } from './market.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('market')
@ApiBearerAuth()
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('/deposit-type')
  async depositType(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.marketService.depositType(date, branch);
  }

  @Get('/customer-type')
  async customerType(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.marketService.customerType(date, branch);
  }

  @Get('/all-ccy')
  async allCcy(
    @Query('branch', new DefaultValuePipe(''))
    branch: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.marketService.allCcy(date, branch);
  }
}
