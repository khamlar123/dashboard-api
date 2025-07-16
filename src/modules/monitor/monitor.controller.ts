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
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('monitor')
@ApiBearerAuth()
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('/profit')
  async depositType(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.profit(date, fixDay);
  }

  @Get('/credit-balance')
  async CreditBalance(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.creditBalance(date, fixDay);
  }

  @Get('/deposit')
  async DepositBalance(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.deposit(date, fixDay);
  }

  @Get('/exchange')
  async Exchange(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.exchange(date, fixDay);
  }

  @Get('/liquidity')
  async liquidity(
    @Query('day', new DefaultValuePipe(''))
    day: string,
    @Query('date', new DefaultValuePipe(''))
    date: string,
  ) {
    const fixDay = String(Number(day) - 1);
    return await this.monitorService.liquidity(date, fixDay);
  }
}
