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
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('/profit')
  async depositType(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.monitorService.profit(date, day);
  }

  @Get('/credit-balance')
  async CreditBalance(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.monitorService.creditBalance(date, day);
  }

  @Get('/deposit')
  async DepositBalance(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.monitorService.deposit(date, day);
  }

  @Get('/exchange')
  async Exchange(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    return await this.monitorService.exchange(date, day);
  }
}
